/*
 * Copyright (c) 2025. Alberto Marchetti - https://www.linkedin.com/in/albertomarchetti/
 */

import 'zx/globals';

// Import the TypeScript config to obtain the location of the output directory
import tsConfig from '../tsconfig.json';

$.verbose = true;

//
// Compiles all the local .ts/.mts scripts to .js/.mjs files
// and prepends a shebang to each
//

const distDir = tsConfig.compilerOptions.outDir;

// Clean the existing output first
await fs.remove(distDir);

// Compile the TypeScript files
await $`npx tsc -p tsconfig.build.json`;

// Move to the output directory
cd(distDir);

// This shebang allows the execution of the script and installation of any missing modules
const shebang = '#!/usr/bin/env -S npx zx --install';

for (const file of await glob('**.{js,mjs}')) {
  echo`Fixing "${file}"`;
  const content = shebang + '\n' + (await fs.readFile(file, 'utf8'));
  await fs.writeFile(file, content);
  // Make the file directly executable
  await fs.chmod(file, 0o775);
}
