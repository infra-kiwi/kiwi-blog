/*
 * Copyright (c) 2025. Alberto Marchetti - https://www.linkedin.com/in/albertomarchetti/
 */

import 'zx/globals';

echo`Processing...`;

const longProcess = $`sleep 3`;

// Show a waiting spinner!
await spinner(() => longProcess);

echo`Done`;
