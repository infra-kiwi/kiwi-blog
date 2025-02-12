/*
 * Copyright (c) 2025. Alberto Marchetti - https://www.linkedin.com/in/albertomarchetti/
 */

import 'zx/globals';

$.verbose = true;

// Get a name
const name = await question('What is your name?');

// Pass the name as stdin to the next command
await $({ input: name })`jq -R '{name: .}'`;
