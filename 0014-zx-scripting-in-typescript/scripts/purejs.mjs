/*
 * Copyright (c) 2025. Alberto Marchetti - https://www.linkedin.com/in/albertomarchetti/
 */
import 'zx/globals';

// ZX is usually shown with pure JS code. While not my favorite way of using it,
// it is nonetheless the most straightforward way, as it does not require ANY setup.

// You can even invoke this script remotely with
// npx zx https://github.com/infra-kiwi/kiwi-blog/blob/main/0014-zx-scripting-in-typescript/scripts/purejs.mjs

const output = await $`date`;

echo`Today is ${output}`;
