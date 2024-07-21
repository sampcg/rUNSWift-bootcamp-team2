import { resolve as resolvePath } from 'path';
import { StreamServer } from './servers/streamServer';
import { TeamServer } from './servers/teamServer';
import { RobotMonitor } from './workers/robotMonitor';
import { DumpMonitor } from './workers/dumpMonitor';

(async () => {
  const dumpName = 'dump1';
  const dumpFilePath = resolvePath(
    __dirname, // current file's folder (src)
    '../../', // project root
    `.temp/${dumpName}.bbd2`,
  );
  const robotMonitor = new RobotMonitor();
  await robotMonitor.start();
  const dumpMonitor = new DumpMonitor('/Volumes/DATA/rUNSWift/RC24');
  // const dumpMonitor = new DumpMonitor(resolvePath(__dirname, '../.dumps'));
  await dumpMonitor.start();
  const streamServer = new StreamServer({ dumpFilePath }, robotMonitor, dumpMonitor);
  await streamServer.start();
  const teamServer = new TeamServer(streamServer, robotMonitor, dumpMonitor);
  await teamServer.start();
})()
  .then(() => {
    console.log('Servers started');
  })
  .catch(console.error);
