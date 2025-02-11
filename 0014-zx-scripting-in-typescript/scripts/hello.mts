/*
 * Copyright (c) 2025. Alberto Marchetti - https://www.linkedin.com/in/albertomarchetti/
 */

import 'zx/globals';

// Get a name
const name = await question('What is your name?');

// Create a temporary directory
const tmp = tmpfile();

interface ObjectWithName {
  name: string;
}

// Dump an object to disk
{
  const obj: ObjectWithName = {
    name
  };

  await fs.writeJson(tmp, obj);
}

// Read it back
{
  const obj: ObjectWithName = await fs.readJson(tmp);

  echo`Hello ${obj.name}!`;
}
