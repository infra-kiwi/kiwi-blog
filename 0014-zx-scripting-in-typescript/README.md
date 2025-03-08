# kiwi-blog-0014-zx-scripting-in-typescript

This folder contains an example on how to set up a TypeScript repository to execute [`zx`](https://github.com/google/zx)
scripts.

You can find the related blog post at: https://blog.infra.kiwi/google-zx-or-how-i-got-rid-of-bash-in-my-life-1e68695f029d

## Usage

Run:

```shell
npm install

# Run any of the scripts in the scripts folder in this way
npx tsx ./scripts/spinner.ts

# Or, for JS-only ones
npx zx ./scripts/purejs.mjs
```

You can also **compile** the scripts in two ways:

1. Simple transpile TS->JS, which will allow them to run via `npx zx --install SCRIPT_PATH`, installing any
   dependencies at runtime. Try with: `npm run compile && ./dist/spinner.mjs`
2. Full bundling via [ESBuild](https://esbuild.github.io/api/#external), which will allow them to run via 
   `node SCRIPT_PATH`, and not require any online connectivity, at the cost of the increased file 
   sizes. Try with: `npm run bundle && ./dist/spinner.mjs` 