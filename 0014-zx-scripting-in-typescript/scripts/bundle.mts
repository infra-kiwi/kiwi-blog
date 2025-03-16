/*
 * Copyright (c) 2025. Alberto Marchetti - https://www.linkedin.com/in/albertomarchetti/
 */

import 'zx/globals';
import * as esbuild from 'esbuild';

// Import the TypeScript config to obtain the location of the output directory
import tsConfig from '../tsconfig.json';
import { pluginReplace } from '../util/esbuild-plugin-replace';

$.verbose = true;

//
// Compiles all the local .ts/.mts scripts to self-contained .js/.mjs files
// and prepends a shebang to each. These scripts will not require any online access
// and can run on their own, at the cost of being of bigger size
//

const scriptsDir = 'scripts';
const distDir = tsConfig.compilerOptions.outDir;

// Clean the existing output first
await fs.remove(distDir);
await fs.mkdirp(distDir);

// This shebang allows the execution of the script
const shebang = '#!/usr/bin/env node';

for (const file of await glob(`${scriptsDir}/**.{js,mjs,ts,mts}`)) {
  echo`Compiling "${file}"`;

  const outFile = path.join(
    distDir,
    file.replace(new RegExp('^' + scriptsDir + '/'), '').replace(/ts$/, 'js')
  );
  const isESM = file.match(/(mts|mjs)$/);
  await esbuild.build({
    entryPoints: [file],
    bundle: true,
    keepNames: true,
    sourcemap: false,
    outfile: outFile,
    platform: 'node',
    format: isESM ? 'esm' : 'cjs',
    banner: {
      js: shebang
    },
    inject: isESM ? ['util/cjs-shim.ts'] : [],
    mainFields: ['module', 'main'],
    // This is a fix for zx, which reads at runtime its own version from the package.json of the zx package
    plugins: [
      pluginReplace([
        {
          filter: /node_modules\/zx\/build\/index\.cjs$/,
          replace:
            /import_vendor\.fs\.readJsonSync\([^;]+package\.json[^;]+\.version;/s,
          replacer: () => {
            return JSON.stringify(VERSION) + ';';
          }
        }
      ])
    ]
  });

  // Make the file directly executable
  await fs.chmod(outFile, 0o775);
}
