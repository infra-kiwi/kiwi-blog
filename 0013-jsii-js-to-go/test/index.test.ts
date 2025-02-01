/*
 * Copyright (c) 2025. Alberto Marchetti - https://www.linkedin.com/in/albertomarchetti/
 */

import { execSync } from 'node:child_process';
import path from 'node:path';

describe('Test the JSII generation', () => {
  test('Go packages are correctly generated', () => {
    // Compile via JSII
    execSync('npm run jsii');

    // Test the generated go package
    expect(
      execSync('go run main.go', {
        cwd: path.join(__dirname, 'go')
      }).toString('utf8')
    ).toContain('Hello Mario!');
  });
});
