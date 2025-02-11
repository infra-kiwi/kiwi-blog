/*
 * Copyright (c) 2025. Alberto Marchetti - https://www.linkedin.com/in/albertomarchetti/
 */

import 'zx/globals';

async function main() {
  echo`Processing...`;

  const longProcess = $`sleep 3`;

  // Show a waiting spinner!
  await spinner(() => longProcess);

  echo`Done, current directory: ${__dirname}`;
}

void main();
