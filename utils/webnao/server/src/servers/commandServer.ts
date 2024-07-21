import Koa from 'koa';
import Router from '@koa/router';
import Logger from 'koa-logger';
import json from 'koa-json';
import { Server } from 'http';

export class CommandServer {
  protected app: Koa;
  protected router: Router;
  protected server?: Server;
  constructor(protected port: number) {
    this.app = new Koa();
    this.router = new Router();
    this.setupRoutes();
    this.setupMiddleware();
  }

  protected setupRoutes() {
    this.router.get('/robots', async (ctx, next) => {
      ctx.body = {
        robots: [],
      };
      await next;
    });
  }

  protected setupMiddleware() {
    this.app.use(json()).use(Logger()).use(this.router.routes()).use(this.router.allowedMethods());
  }

  public async start() {
    await new Promise<void>((resolve, reject) => {
      this.server = this.app.listen(this.port);
      const listeningHandler = () => {
        this.server?.removeListener('error', errorHandler);
        resolve();
      };
      const errorHandler = (error: Error) => {
        this.server?.removeListener('listening', listeningHandler);
        reject(error);
      };
    });
  }

  public async stop() {
    if (this.server) {
      await new Promise<void>((resolve, reject) =>
        this.server?.close((error) => {
          if (error) {
            return reject(error);
          }
          resolve();
        }),
      );
    }
  }
}
