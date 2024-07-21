import { robotExtractMiddleware } from '../utils/extractRobotImages';

export class RobotImagesExtractor {
  private ws: WebSocket | undefined;
  public start(port: number) {
    this.ws = new WebSocket(`ws://localhost:${port}/`);
    this.ws.onmessage = async (ev) => {
      const buffer = await (ev.data as Blob).arrayBuffer();
      const data = new Uint8Array(buffer);
      this.tick(data);
    };
  }
  tick(bb: Uint8Array) {
    robotExtractMiddleware(bb);
  }
}
