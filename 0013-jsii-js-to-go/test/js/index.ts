/*
 * Copyright (c) 2025. Alberto Marchetti - https://www.linkedin.com/in/albertomarchetti/
 */

import { Addressor, Constants, Home } from '../../lib';

function main() {
  const home: Home = {
    address: 'Wariolane 24'
  };

  const addressor = new Addressor();
  const greeting = addressor.getFullGreeting(Constants.name, home);

  console.log(greeting);
}

void main();
