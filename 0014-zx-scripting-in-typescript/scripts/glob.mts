/*
 * Copyright (c) 2025. Alberto Marchetti - https://www.linkedin.com/in/albertomarchetti/
 */

import 'zx/globals';

// Prints the list of all files matching the glob pattern, but
// avoid the node_modules folder
const files = await glob(['**/*.mts', '!**/node_modules']);

echo`All the MTS files: ${files}`;
