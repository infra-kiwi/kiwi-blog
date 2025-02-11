/*
 * Copyright (c) 2025. Alberto Marchetti - https://www.linkedin.com/in/albertomarchetti/
 */

import 'zx/globals';

// Interop with the local system
// https://google.github.io/zx/process-promise

// Executes a process and gets its output
{
  const date = await $`date +"%Y-%m-%dT%H:%M:%S%z"`;
  echo`Date: ${date}`;
}

// Executes a process and iterates over its output
{
  // Note the lack of await here
  const ls = $`ls -al`;

  for await (const l of ls) {
    echo`Line: ${l}`;
  }
}

// Executes a process and treat its output as JSON
// https://google.github.io/zx/process-promise#json-text-lines-buffer-blob
{
  const output = await $`jq -n '{name:"Mario"}'`.json();
  echo`Hello ${output.name}`;
}
