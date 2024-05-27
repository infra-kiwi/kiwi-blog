/*
 * Copyright (c) 2024. Alberto Marchetti - https://www.linkedin.com/in/albertomarchetti/
 */

// @ts-check

import eslint from '@eslint/js';
import jestPlugin from 'eslint-plugin-jest';
import tseslint from 'typescript-eslint';

export default tseslint.config({
  extends: [eslint.configs.recommended, ...tseslint.configs.recommended],
  plugins: {
    jest: jestPlugin
  },
  languageOptions: {
    parser: tseslint.parser,
    sourceType: 'module',
    parserOptions: {
      project: true
    }
  },
  rules: {
  },
  ignores: [
    'node_modules/**',
    '*.d.ts',
    'cdk.out/**',
    '*.config.mjs'
  ]
});
