/*
 * Copyright (c) 2025. Alberto Marchetti - https://www.linkedin.com/in/albertomarchetti/
 */

// Original credit goes to https://github.com/esbuild-plugins-community/esbuild-plugin-replace
// This is a readapted version that allows filtering node_modules files

import { OnLoadArgs, Plugin } from 'esbuild';

export type TypeOptions = Array<TypeModifier>;
export type TypeModifier = {
  filter: RegExp;
  replace: string | RegExp;
  replacer: (
    onLoadArgs: OnLoadArgs,
    fileContent: string
  ) => string | ((substring: string, ...args: Array<string>) => string);
};

export const pluginReplace = (options: TypeOptions): Plugin => {
  return {
    name: 'custom-plugin-replace',
    setup(build) {
      build.onLoad(
        {
          filter: /./g
        },
        async (args) => {
          const matchingModifiers = options.filter((option) =>
            option.filter.test(args.path.replaceAll(path.sep, path.posix.sep))
          );

          if (!matchingModifiers.length) {
            return;
          }

          const fileContent = fs.readFileSync(args.path, 'utf-8');

          return {
            contents: matchingModifiers.reduce((contents, modifier) => {
              return contents.replace(
                modifier.replace,
                modifier.replacer(args, fileContent) as never
              );
            }, fileContent),
            loader: 'default'
          };
        }
      );
    }
  };
};
