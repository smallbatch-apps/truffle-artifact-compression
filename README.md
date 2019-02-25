# Truffle JSON Compression

The artifacts created by Truffle by default include a number of exceptionally large objects. Most notably the AST, which can easily be 15,000 lines of code. Not only is this present, but it's also duplicated in a "legacyAST".

The goal of this project is to strip out these typically-unused bulk objects and make a smaller final payload, drastically reducing the size of a JavaScript app built with Truffle. Many applications are only really using this large file to provide the address of the contract.

It may also be used to assist in any workflow where the JSON files themselves are stored or served, as even a completely non-destructive pass will **halve** the file size.


| Original JSON | No Data Loss | Remove Legacy | Stripped Down |
| ------------- | ------------ | ----------- | ----------- |
| 149,813 bytes | 75,671 bytes | 13,905 bytes | 1,821 bytes |

# How it works

By default the program will strip out all of the artifact keys found in the following array.

```
['source', 'ast', 'legacyAST', 'sourceMap', 'deployedSourceMap', 'bytecode', 'deployedBytecode']
```

You can tell it that you want to keep any or all of these by defining them as an argument. It is important to stress that with no arguments given all of these objects **will be removed**. This is by definition a destructive process, and it will not ask you to confirm it.

# Usage

This is a command line utility that is most likely to be run as a command in a build process, and most easily run using `npx`. My own build command, for example is

```
npx truffle-json-compress --ast-object && npx parcel build index.html --no-source-maps
```

For many users, they'll simply add to their webpack build command in `package.json`:

```
  "build": "npx truffle-json-compress && webpack -p --config webpack.prod.js"
```

Though this seems complicated it's simply executed by running `npm run build`.

## Arguments

| Option | Default | Effect |
| --- | --- | ---|
| --input \<directory\> | `build/contracts` | Where to find the json files needed |
| --output \<directory\> | Wherever the input is | Where to output the processed files* |
| --keep \<keysToKeep\> | none | Allows you to specify a comma separated list of things you actually need |
| --ast-object | false | explained below |

\* this **will** overwrite existing files - with no warning

### Input and Output Directories

Much of this should be self-explanatory. The input directory is where to find the built truffle json. Note that it actually doesn't look for any specific features of those files, just files named `<something>.json`. Its only safety feature is that it will not do anything to a `package.json` or `package-lock.json`.

The input directory is relative to current working directory, and defaults to truffle's default build output: `build/contracts`. The input does not second guess or calculate its location. `cd build/contracts && npx truffle-json-compress` will essentially be a no-op as it finds no files in the directory `/build/contracts/build/contracts`.

The output directory is the input directory unless explicitly set. This means by default it will be `build/contracts` but if you change the input it will output to the same directory.

```
npx truffle-json-compress --output build/contracts/compressed
```

Both input and output directories must already exist - the utility will not create directories and will error if not found.

### Keeping Keys

As stressed above the design goal of this tool **is to strip out truffle json keys** and it does so quite aggressively. There are specific usecases, and I'm certain Drizzle is one of them, where at least some of these are actually necessary. For example, if Drizzle has a need for `source` and `bytecode`, so we can keep that by simply doing this.

```
npx truffle-json-compress --keep source,bytecode
```

**Note that no spaces are allowed in the keep field list.**


### AST Object

The AST object is a small object that saves a more efficient representation of the AST inputs and outputs, so that they can be used in applications that would potentially translate between the types or outputs, converting strings to bytes32 or even array outputs to a struct. Some of my own code does this.

Though it is off by default it can be useful if you are making your own application and you want to be able to, for example, programmatically see what fields are in a given struct, the text value of an enum, or what the outputs of an event are.
