import { OptionValues, program } from 'commander';
import glob from 'fast-glob';
import { streamBlackboardBytesFromBBD2File } from './utils/blackboardStreaming';
import { robotExtractMiddlewareTransform } from './utils/extractRobotImages';
import { Transform } from 'stream';
import { topImageExtractMiddlewareTransform } from './utils/extractTopFrames';

type StreamMiddleware = () => Transform;

enum ProcessorMiddlewares {
  robotImages = 'robotImages',
  topFrames = 'topFrames'
}
const middlewareMap = {
  [ProcessorMiddlewares.robotImages]: robotExtractMiddlewareTransform,
  [ProcessorMiddlewares.topFrames]: topImageExtractMiddlewareTransform
};
interface ProcessorOptions extends OptionValues {
  middleware: ProcessorMiddlewares;
  dumps: string;
}
program
  .requiredOption(
    '--middleware <middleware>',
    `Which middleware to use. Currently supported [${Object.keys(middlewareMap).join(', ')}]`,
  )
  .requiredOption(
    '--dumps <dumps>',
    'path to dumps, can be a comma-separated list of globs, e.g. ".dumps/a/*.bbd2, .dumps/b/*.bbd2"',
  );

async function collectDumps(dumps: string) {
  const dumpList = dumps.split(',');
  const cwd = process.cwd();
  const allDumps = await glob(dumpList, { cwd });
  return allDumps;
}
function processDump(dumpFilePath: string, middlewares: StreamMiddleware[]) {
  return new Promise<void>((resolve, reject) => {
    let stream = streamBlackboardBytesFromBBD2File(dumpFilePath);
    for (const middleware of middlewares) {
      stream = stream.pipe(middleware());
    }
    const onEnd = () => {
      resolve();
    };
    stream.on('finish', onEnd).on('error', (error) => {
      reject(error);
    });
  });
}
async function main() {
  program.parse();
  const options = program.opts<ProcessorOptions>();
  const middleware = middlewareMap[options.middleware];
  if (!middleware) {
    throw new Error(`Couldn't find middleware [${options.middleware}]`);
  }
  const allDumps = await collectDumps(options.dumps);
  console.log('About to process the following dump files:');
  console.log(allDumps);
  for (const dumpFile of allDumps) {
    console.log('** starting', dumpFile);
    await processDump(dumpFile, [middleware]);
    console.log('** done with', dumpFile);
  }
}

main().catch(console.error);
