/*
 * Copyright (c) 2025. Alberto Marchetti - https://www.linkedin.com/in/albertomarchetti/
 */

import 'zx/globals';

$.verbose = true;

const tmp = tmpdir();

// Change to the temporary directory, and any subsequent
// commands will be executed in it
cd(tmp);

echo`Current dir: ${await $`pwd`}`;

// Write a file
await fs.writeFile('hey.txt', 'Hello!');
await $`ls -al`;

echo`Current dir: ${await $`pwd`}`;
