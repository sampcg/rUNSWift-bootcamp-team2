import { DumpRobotInfo } from '@common/models/robotsInfo';
import { resolve as resolvePath } from 'path';
import { createReadStream, constants } from 'fs';
import { readFile, writeFile, access, stat } from 'node:fs/promises';
import { BB_NUM_HEADER_BYTES, getBlackboardBytesTransform } from '../utils/blackboardTransforms';
import { Blackboard } from '@common/blackboard';
import glob from 'fast-glob';
import md5 from 'md5';
import { getSomeBlackboardsFile } from '../utils/blackboardStreaming';

async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}
class DumpIndex extends Map<number, number> {
  _keys: number[];
  constructor(entries?: readonly (readonly [number, number])[] | null) {
    super(entries);
    this._keys = [];
    this.updateKeys();
  }
  public set(key: number, value: number) {
    super.set(key, value);
    this.updateKeys();
    return this;
  }
  protected updateKeys() {
    this._keys = Array.from(this.keys()).sort();
  }
  getNextKey(key: number) {
    const index = this._keys.indexOf(key);
    if (index === -1) {
      return undefined;
    }
    if (index === this._keys.length - 1) {
      return undefined;
    }
    return this._keys[index + 1];
  }
  getPreviousKey(key: number) {
    const index = this._keys.indexOf(key);
    if (index === -1) {
      return undefined;
    }
    if (index === 0) {
      return this._keys[0];
    }
    return this._keys[index - 1];
  }
  getClosestKey(key: number) {
    const index = this.getClosestKeyIndex(key);
    if (index === -1) {
      return undefined;
    }
    return this._keys[index];
  }
  getClosestKeyIndex(key: number) {
    const index = this._keys.indexOf(key);
    if (index !== -1) {
      return index;
    }
    const sortedKeys = this._keys.slice().sort((a, b) => {
      const diffA = Math.abs(a - key);
      const diffB = Math.abs(b - key);
      if (diffA < diffB) {
        return -1;
      }
      if (diffA > diffB) {
        return 1;
      }
      return 0;
    });
    return this._keys.indexOf(sortedKeys[0]);
  }
  get firstKey() {
    return this._keys[0];
  }
}
export type DumpMonitorOnChangeCallback = (robots: DumpRobotInfo[]) => Promise<void>;
export class DumpMonitor {
  protected _dumpMap: Map<string, DumpRobotInfo>;
  protected _dumpIndexes: Map<string, DumpIndex>;
  protected dumpWSEndpoints: Map<string, string>;
  protected _dumpState: DumpRobotInfo[];
  protected onChangeCallbacks: DumpMonitorOnChangeCallback[];
  protected lastUpdateMD5: string;
  public get dumpState() {
    return this._dumpState;
  }
  constructor(
    protected dumpFolderPath: string,
    protected scanSeconds: number = 10,
  ) {
    this._dumpState = [];
    this.onChangeCallbacks = [];
    this.dumpWSEndpoints = new Map<string, string>();
    this._dumpMap = new Map<string, DumpRobotInfo>();
    this._dumpIndexes = new Map<string, DumpIndex>();
    this.lastUpdateMD5 = '';
  }
  public async start() {
    this.scheduleRefresh(1000);
  }
  public async setDumpWSEndpoint(dumpPath: string, endpoint?: string) {
    if (endpoint) {
      this.dumpWSEndpoints.set(dumpPath, endpoint);
    } else {
      this.dumpWSEndpoints.delete(dumpPath);
    }
    const dump = this._dumpMap.get(dumpPath);
    if (dump) {
      dump.WSEndpoint = endpoint;
    }
  }
  public resolveDumpPath(path: string) {
    return resolvePath(this.dumpFolderPath, path);
  }
  public resolveDumpIndexPath(path: string) {
    return resolvePath(this.dumpFolderPath, path + '.index');
  }
  public resolveDumpInfoPath(path: string) {
    return resolvePath(this.dumpFolderPath, path + '.json');
  }
  public subscribe(callback: DumpMonitorOnChangeCallback) {
    if (!this.onChangeCallbacks.includes(callback)) {
      this.onChangeCallbacks.push(callback);
    }
  }
  public unsubscribe(callback: DumpMonitorOnChangeCallback) {
    const ind = this.onChangeCallbacks.indexOf(callback);
    if (ind > -1) {
      this.onChangeCallbacks = this.onChangeCallbacks.splice(ind, 1);
    }
  }
  protected scheduleRefresh(interval = this.scanSeconds * 1000) {
    setTimeout(async () => {
      await this.refresh();
    }, interval);
  }
  protected async refresh() {
    try {
      await this.findDumps();
      this._dumpState = Array.from(this._dumpMap.values());
      await this.notifyIfChanged();
      await Promise.all(this._dumpState.map((dumpInfo) => this.ensureDumpIndex(dumpInfo.path)));
      this._dumpState = Array.from(this._dumpMap.values());
      await this.notifyIfChanged();
      await Promise.all(this._dumpState.map((dumpInfo) => this.hydrateDump(dumpInfo.path)));
      this._dumpState = Array.from(this._dumpMap.values());
      await this.notifyIfChanged();
    } finally {
      this.scheduleRefresh();
    }
  }
  protected async notifyIfChanged() {
    const currentMD5 = md5(JSON.stringify(this._dumpState));
    if (currentMD5 != this.lastUpdateMD5) {
      this.lastUpdateMD5 = currentMD5;
      await this.notifySubscribers();
    }
  }
  protected async notifySubscribers() {
    await Promise.all(this.onChangeCallbacks.map((callback) => callback(this.dumpState)));
  }
  protected async saveIndexToFile(index: DumpIndex, indexFile: string): Promise<void> {
    const buffer = Buffer.alloc(index.size * 2 * (64 / 8));
    let offset = 0;
    for (const [timestamp, address] of index) {
      offset = buffer.writeBigUInt64BE(BigInt(timestamp), offset);
      offset = buffer.writeBigUInt64BE(BigInt(address), offset);
    }
    await writeFile(indexFile, buffer);
  }
  protected serializeDump(dumpInfo: DumpRobotInfo): string {
    return JSON.stringify(dumpInfo);
  }
  protected deserializeDump(dumpString: string): DumpRobotInfo {
    return JSON.parse(dumpString);
  }
  protected async saveDumpInfo(dumpInfo: DumpRobotInfo): Promise<void> {
    const infoPath = this.resolveDumpInfoPath(dumpInfo.path);
    await writeFile(infoPath, this.serializeDump(dumpInfo));
  }
  protected async loadDumpInfo(dumpInfoFile: string): Promise<DumpRobotInfo> {
    const dumpString = await readFile(dumpInfoFile, { encoding: 'utf-8' });
    const loadedInfo = this.deserializeDump(dumpString);
    return loadedInfo;
  }
  protected async loadIndexFromFile(indexFile: string): Promise<DumpIndex> {
    const index = new DumpIndex();
    const fileStream = createReadStream(indexFile, { highWaterMark: 2 * (64 / 8) });
    return new Promise((resolve, reject) => {
      const onEnd = () => {
        resolve(index);
      };
      fileStream
        .on('data', (chunk: Buffer) => {
          const timestamp = Number(chunk.readBigUint64BE(0));
          const address = Number(chunk.readBigUint64BE(64 / 8));
          index.set(timestamp, address);
        })
        .on('end', onEnd)
        .on('close', onEnd)
        .on('finish', onEnd)
        .on('error', (error) => {
          reject(error);
        });
    });
  }
  public async getDumpIndex(dumpPath: string): Promise<DumpIndex> {
    let dumpIndex = this._dumpIndexes.get(dumpPath);
    if (!dumpIndex) {
      const dumpIndexFile = this.resolveDumpIndexPath(dumpPath);
      if (await fileExists(dumpIndexFile)) {
        dumpIndex = await this.loadIndexFromFile(dumpIndexFile);
        console.info(`Loaded dump index [${dumpPath}]`);
      } else {
        console.info(`Indexing dump [${dumpPath}]`);
        dumpIndex = await this.indexDump(dumpPath);
        console.info(`Saving dump index [${dumpPath}]`);
        await this.saveIndexToFile(dumpIndex, dumpIndexFile);
        console.info(`Saved dump index [${dumpPath}]`);
      }
      this._dumpIndexes.set(dumpPath, dumpIndex);
    }
    if (!dumpIndex) {
      throw new Error(`Can't get index for [${dumpIndex}]`);
    }
    return dumpIndex;
  }
  protected async indexDump(dumpPath: string): Promise<DumpIndex> {
    const path = this.resolveDumpPath(dumpPath);
    const totalSizeBytes = (await stat(path)).size;
    let percentReported = 0;
    let progressPercentage = 0;
    const inputFile = createReadStream(path);
    const index = new DumpIndex();
    const stream = inputFile.pipe(getBlackboardBytesTransform());
    let frameIndex = BB_NUM_HEADER_BYTES;
    return new Promise<DumpIndex>((resolve, reject) => {
      const onEnd = () => {
        resolve(index);
      };
      stream
        .on('data', (blackboardBuffer: Buffer) => {
          const blackboard = Blackboard.decode(blackboardBuffer);
          const timestamp = blackboard.vision?.timestamp || 0;
          if (timestamp > 0) {
            index.set(timestamp, frameIndex);
          }
          frameIndex = frameIndex + blackboardBuffer.length + BB_NUM_HEADER_BYTES;
          progressPercentage = Math.floor(100 * frameIndex / totalSizeBytes);
          if (progressPercentage - percentReported > 1) {
            console.info(`[${dumpPath}] indexed at ${percentReported}%`)
            percentReported = progressPercentage;
          }
        })
        .on('end', onEnd)
        .on('close', onEnd)
        .on('finish', onEnd)
        .on('error', (error) => {
          reject(error);
        });
    });
  }
  protected async findDumps(): Promise<void> {
    const paths = await glob(['**/*.bbd2'], { cwd: this.dumpFolderPath });
    const infos = await Promise.all(paths.map((path) => this.getDumpInfo(path)));
    for (const dumpInfo of infos) {
      if (!this._dumpMap.get(dumpInfo.path)) {
        this._dumpMap.set(dumpInfo.path, dumpInfo);
      }
    }
  }
  protected async getDumpInfo(dumpPath: string): Promise<DumpRobotInfo> {
    const { size } = await stat(this.resolveDumpPath(dumpPath));
    const sizeGbs = size / 1e9;
    return {
      path: dumpPath,
      sizeGbs,
    };
  }
  protected async hydrateDump(dumpPath: string) {
    const dumpInfo = this._dumpMap.get(dumpPath);
    if (!dumpInfo) {
      return;
    }
    const infoPath = this.resolveDumpInfoPath(dumpInfo.path);
    if (await fileExists(infoPath)) {
      const updatedInfo = await this.loadDumpInfo(infoPath);
      this._dumpMap.set(dumpPath, updatedInfo);
      return;
    }
    const filePath = this.resolveDumpPath(dumpPath);
    const blackboards = await getSomeBlackboardsFile({ filePath, count: 1, timeout: 15000 });
    const blackboard = blackboards[0];
    if (blackboard) {
      dumpInfo.mask = blackboard.mask;
      dumpInfo.teamInfo = {
        playerNumber: blackboard.gameController?.playerNumber,
        teamNumber: blackboard.gameController?.ourTeam?.teamNumber,
      };
    }
    this._dumpMap.set(dumpPath, dumpInfo);
    await this.saveDumpInfo(dumpInfo);
  }
  protected async ensureDumpIndex(path: string): Promise<void> {
    const index = await this.getDumpIndex(path);
    const dumpInfo = this._dumpMap.get(path);
    if (dumpInfo && !dumpInfo.timestamps) {
      dumpInfo.timestamps = index._keys;
      dumpInfo.lengthSeconds = (index._keys[index._keys.length - 1] - index._keys[0]) / 1000000;
    }
  }
}
