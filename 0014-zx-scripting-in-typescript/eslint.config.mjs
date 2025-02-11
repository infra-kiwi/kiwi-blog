/*
 * Copyright (c) 2025. Alberto Marchetti - https://www.linkedin.com/in/albertomarchetti/
 */

import globals from 'globals';
import * as zxGlobals from 'zx';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ['**/*.{js,mjs,cjs,ts,mts}']
  },
  {
    languageOptions: {
      globals: {
        ...globals.node,
        // Fancy hack to enable js/mjs support for zx global vars
        ...Object.fromEntries(
          Object.entries(zxGlobals).map(([key]) => [key, false])
        )
      }
    }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      // This does not work together with template literals
      '@typescript-eslint/no-unused-expressions': 'off'
    }
  },
  // https://github.com/eslint/eslint/discussions/18304#discussioncomment-9069706
  {
    ignores: ['dist/**/*', 'node_modules/**/*']
  }
];
