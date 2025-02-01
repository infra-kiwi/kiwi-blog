/*
 * Copyright (c) 2025. Alberto Marchetti - https://www.linkedin.com/in/albertomarchetti/
 */

export class Constants {
  static readonly name = 'Mario';
}

export interface Home {
  readonly address: string;
}

export class Addressor {
  getFullGreeting(name: string, home: Home) {
    return `Hello ${Constants.name}! You live at ${home.address}.`;
  }
}
