# JS codemods

Preview code AST of the target code using [AST explorer](https://astexplorer.net/).
To interactively test and update codemods might be helpful to use [ndb](https://github.com/GoogleChromeLabs/ndb).

```sh
ndb npx jscodeshift -t ./transforms/something.js --extensions=ts --parser=ts ./src/**/*container.ts
```

## Usage

1. `yarn`
2. `npx jscodeshift -t ./transforms/[transform].js [files]`
3. Review changes via `git diff`. Keep what you want, throw it out if you don't. Magic!

## Option flags

When executing codemods, you can configure options like so:

`npx jscodeshift -t node_modules/5to6-codemod/transforms/[transform].js [files] --key=value`

### Recast options

Transforms will automatically distinguish and pass through Recast config keys via [jscodeshift](https://github.com/facebook/jscodeshift#passing-options-to-recast). Official documentation for Recast's configuration can be found [here](https://github.com/benjamn/recast/blob/4899a70d4b9aeec9c599065be3338464b7047767/lib/options.js#L1). The following Recast keys are supported:

- `esprima`
- `inputSourceMap`
- `lineTerminator`
- `quote`
- `range`
- `reuseWhitespace`
- `sourceFileName`
- `sourceMapName`
- `sourceRoot`
- `tabWidth`
- `tolerant`
- `trailingComma`
- `useTabs`
- `wrapColumn`

## Known issues

Some TS features might not work because latest release of jscodeshift is not yet published to NPM.
https://github.com/facebook/jscodeshift/issues/330
