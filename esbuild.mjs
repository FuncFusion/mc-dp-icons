import * as esbuild from 'esbuild';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { existsSync } from 'fs';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));

const isWatch = process.argv.includes('--watch');
const isProduction = process.env.NODE_ENV === 'production';

const commonOptions = {
  bundle: true,
  sourcemap: true,
  minify: isProduction,
  format: 'cjs',
  platform: 'node',
  external: ['vscode'],
};

const desktopConfig = {
  ...commonOptions,
  entryPoints: ['src/extension.ts'],
  outfile: 'out/extension.js',
};

const webConfig = {
  ...commonOptions,
  platform: 'browser',
  entryPoints: ['src/webExtension.ts'],
  outfile: 'out/webExtension.js',
};

async function build() {
  if (!existsSync('src/data/baseTheme.ts')) {
    console.log('baseTheme.ts missing, running generate...');
    execSync('bun run generate', { stdio: 'inherit' });
  }

  if (isWatch) {
    const desktopCtx = await esbuild.context(desktopConfig);
    const webCtx = await esbuild.context(webConfig);

    await desktopCtx.watch();
    await webCtx.watch();

    console.log('Watching for changes...');
  } else {
    await esbuild.build(desktopConfig);
    console.log('Desktop build complete');

    await esbuild.build(webConfig);
    console.log('Web build complete');
  }
}

build().catch(() => process.exit(1));
