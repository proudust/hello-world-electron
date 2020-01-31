import * as procces from 'child_process';
import * as builder from 'electron-builder';
import { fusebox, sparky } from 'fuse-box';
import { promisify } from 'util';

class Context {
  public isProduction: boolean | undefined = undefined;

  public getMainConfig(): ReturnType<typeof fusebox> {
    return fusebox({
      entry: 'index.ts',

      target: 'electron',
      output: 'dist/main/$name-$hash',
      homeDir: 'src/main',
      useSingleBundle: true,
      dependencies: { ignoreAllExternal: true },
      cache: {
        enabled: true,
        root: '.cache/main',
      },

      logging: { level: 'succinct' },
    });
  }

  public getRendererConfig(): ReturnType<typeof fusebox> {
    const template = this.isProduction ? 'index.prod.html' : 'index.dev.html';
    return fusebox({
      entry: 'index.tsx',

      target: 'browser',
      output: 'dist/renderer/$name-$hash',
      homeDir: 'src/renderer',
      webIndex: {
        publicPath: './',
        template: `src/renderer/${template}`,
      },
      cache: {
        enabled: false,
        root: '.cache/renderer',
      },
      dependencies: { include: ['tslib'] },

      devServer: {
        httpServer: false,
        hmrServer: { port: 7878 },
      },

      logging: { level: 'succinct' },
    });
  }
}

const { task, rm, exec } = sparky(Context);

task('dev', async context => {
  context.isProduction = false;

  await rm('./dist');

  await promisify(procces.exec)(`tsc ./src/main/preload.ts --outDir ./dist`);
  await context.getRendererConfig().runDev();
  await context.getMainConfig().runDev(handler => {
    handler.onComplete(output => {
      output.electron.handleMainProcess();
    });
  });
});

async function build(context: Context, isDir: boolean): Promise<void> {
  context.isProduction = true;

  await rm('./dist');

  await promisify(procces.exec)(`tsc ./src/main/preload.ts --outDir ./dist`);
  await context.getRendererConfig().runProd({ uglify: false });
  const response = await context.getMainConfig().runProd({ uglify: true });

  const main = `./main/${response.bundles[0].stat.localPath}`;
  await builder.build({
    dir: isDir,
    config: {
      appId: 'io.github.proudust.helloworld-electron',
      extraMetadata: { main },
      files: [
        '!**/*',
        { filter: 'package.json' },
        { from: './dist', filter: ['main', 'renderer', 'preload.js'] },
      ],
      win: {
        target: 'portable',
      },
      mac: {
        target: 'zip',
      },
      linux: {
        target: 'zip',
      },
    },
  });
}

task('build', () => exec('build:prod'));
task('build:prod', async context => build(context, false));
task('build:dir', async context => build(context, true));
