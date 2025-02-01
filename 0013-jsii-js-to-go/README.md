# kiwi-blog-0013-jsii-js-to-go

This folder contains an example on how to use [JSII](https://aws.github.io/jsii/) to generate Go-compatible code from a TypeScript codebase.

## Important files

* Index file: [lib/index.ts](lib/index.ts)
* Go test file: [test/go/main.go](test/go/main.go)

## Usage

Run:

```shell
npm install

# Compiles the TypeScript code and generates the Go package
npm run jsii
```

From inside the `test/go` directory, verify the generation with

```shell
go run main.go
```

This should print a hello message.