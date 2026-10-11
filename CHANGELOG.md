# Changelog

## 1.0.0

This release upgrades to [`highlight-words-core` 2.0](https://github.com/bvaughn/highlight-words-core/blob/main/CHANGELOG.md).

### Breaking changes

- **React 16.3 or newer is required** (for `forwardRef`); React 0.14, 15, and 16.0–16.2 are no longer supported.
- **String search words are matched literally by default** (`autoEscape` now defaults to `true`), so characters like `(`, `.`, and `$` match themselves. To match patterns, pass `RegExp` search words, or set `autoEscape={false}` for trusted input only.
- **Custom `findChunks` functions must include a `searchIndex`** (the index within `searchWords` of the search word that matched) in each chunk they return, and the exported `Chunk` type now requires it. They also receive every option with its default applied, and receive `searchWords` as a `ReadonlyArray` (so TypeScript functions that declare it as a mutable array, e.g. `string[]`, must update their parameter type).
- The package now defines `exports`, so only the package root (`react-highlight-words`) can be imported; deep imports (e.g. `react-highlight-words/dist/react-highlight-words.js`) are no longer available.
- `highlight-words-core` 2.0 is published as ES2020 (e.g. `??`), so environments and bundlers that can't parse that syntax (e.g. webpack 4) need to transpile it.
- When `autoEscape` is `false`, string search words that aren't valid regular expressions (e.g. `"(a"`) are matched literally instead of throwing an error.
- When a `sanitize` function changes the text, it is applied to each character separately (so that matches can be mapped back to the original text). Sanitizers that depend on context will give different results.

### New features

- `searchWords` can include `RegExp` objects, which are used as-is (with their own flags).
- `searchWords` can be a readonly array (e.g. `["a", "b"] as const`).
- Custom `highlightTag` components receive a `searchIndex` prop: the index (within `searchWords`) of the search word that matched.
- A `ref` is forwarded to the outer/wrapper `<span>` (this requires React 16.3 or newer).
- The `FoundChunk` type is exported (as an alias of `Chunk`, matching its name in `highlight-words-core`).

### Bug fixes

- Matches line up with the original text when the `sanitize` function changes its length (e.g. `latinize("Æ")` is `"AE"`).
- Surrogate pairs (e.g. emoji) are no longer split between highlighted and unhighlighted text.
- A missing or non-string `textToHighlight` (from untyped callers) no longer throws an error.
- When `highlightClassName` is an object, matches whose text isn't one of its keys (e.g. because `sanitize` changed it, or overlapping matches were combined) use the class of the search word that matched, and no longer get an `"undefined"` class name.
- Inactive matches no longer have a trailing space in their class name, and matches and unhighlighted text with no class name no longer render an empty `class=""` attribute.
- TypeScript declarations are correct for CommonJS consumers: `require("react-highlight-words")` (or `import Highlighter = require(...)`) is typed as the component itself, and the types are available as e.g. `Highlighter.HighlighterProps`. Previously, projects using `"moduleResolution": "node16"` couldn't import the package from CommonJS files.
- When `highlightClassName` is an object, matches like `"constructor"` or `"toString"` no longer get a class name from properties every object inherits.

## 0.21.1

The component's behavior is unchanged, but the package is now built with Vite instead of webpack. Check the packaging changes below if you use an older bundler or runtime, or load the UMD build.

- Add TypeScript type definitions (`dist/react-highlight-words.d.ts`), including exported `HighlighterProps`, `HighlightTagProps`, `UnhighlightTagProps`, `Chunk` and `FindChunksOptions` types.
- Add an ES module build (`dist/react-highlight-words.js`), exposed through the `module` field.
- Move the CommonJS entry point from `dist/main.js` to `dist/react-highlight-words.cjs`. `require("react-highlight-words")` still returns the component directly.
- Target modern JavaScript (ES2018+: object spread, destructuring defaults, `const`/`let`) instead of ES5. Environments that can't parse that syntax need to transpile the package.
- Stop bundling `highlight-words-core` into the build; it is installed as a regular dependency (`^1.2.0`).
- Lowercase the keys of an object `highlightClassName` once per render instead of once per match (when `caseSensitive` is `false`).
- Remove the UMD build (`dist/main.umd.js`).
- Remove the `memoize-one` dependency.

## 0.21.0

- Add React 19 to the supported `react` peer dependency range by @sergei-startsev in [#123](https://github.com/bvaughn/react-highlight-words/pull/123).
- Set `autoEscape` to `true` on the demo website by @dorobila in [#102](https://github.com/bvaughn/react-highlight-words/pull/102).
- Fix a typo in tests by @RyanChadly in [#111](https://github.com/bvaughn/react-highlight-words/pull/111).

## 0.20.0

- Add `unhighlightTag` prop by @kaungmyatlwin in [#99](https://github.com/bvaughn/react-highlight-words/pull/99).

## 0.19.0

- Add `unhighlightTag` prop by @kaungmyatlwin in [#99](https://github.com/bvaughn/react-highlight-words/pull/99).

## 0.18.0

- Add basic React 18 support by @sergei-startsev in [#100](https://github.com/bvaughn/react-highlight-words/pull/100).

## 0.17.0

- Add React 17 to the supported `react` peer dependency range by @sergei-startsev in [#95](https://github.com/bvaughn/react-highlight-words/pull/95).

## 0.16.0

- Pass unrecognized props through to the wrapper `<span>` ([#69](https://github.com/bvaughn/react-highlight-words/issues/69)).

## 0.15.1

- Only pass the `highlightIndex` prop to custom `highlightTag` components, not DOM elements, to avoid React unknown-prop warnings.

## 0.15.0

- Pass `highlightIndex` to the `highlightTag` component.

## 0.14.0

- Add a UMD bundle (`dist/main.umd.js`).

## 0.13.0

- Accept `RegExp` values as well as strings in `searchWords`.

## 0.12.0

- Accept an object for `highlightClassName` that maps search words to class names, so different matches can be styled differently. Keys are matched case-insensitively unless `caseSensitive` is set.
- Add the `memoize-one` dependency.

## 0.11.0

- Add `findChunks` prop for custom match logic.
- Update `highlight-words-core` to 1.1.2 for bug fixes.

## 0.10.0

- Add `caseSensitive` prop.

## 0.9.0

- Add `activeStyle` prop.
- Accept class and function components as well as tag names in `highlightTag`.

## 0.8.1

- Add React 16 to the supported `react` peer dependency range.

## 0.8.0

- Add `unhighlightClassName` and `unhighlightStyle` props.
- Change `activeIndex` from a string to a number.

## 0.7.2

- Use the `prop-types` package to avoid React's `PropTypes` deprecation warning.

## 0.7.1

- Exclude `.babelrc` from the published package.

## 0.7.0

- Pass `className` through to the wrapper `<span>`.

## 0.6.0

- Add `activeIndex` and `activeClassName` props.

## 0.5.0

- Add `highlightTag` prop.

## 0.4.1

- Move the matching utilities into the separate `highlight-words-core` package. `combineChunks`, `fillInChunks`, `findAll` and `findChunks` are no longer exported from this package.

## 0.4.0

- Add `autoEscape` prop to escape RegExp special characters in `searchWords`.

## 0.3.0

Includes the unpublished 0.1.8–0.1.12 and 0.2.0 versions.

- Add `sanitize` prop to normalize text and search words before matching (for example, to match unaccented search words against accented text).

## 0.1.7

- Remove the default style for highlighted text in favor of the browser's default `<mark>` style.

## 0.1.6

- Fix the external name used for `react` in the build.

## 0.1.5

- Stop bundling React into the build.
- Add `.npmignore`.

## 0.1.4

- Export the `combineChunks`, `fillInChunks`, `findAll` and `findChunks` utility functions.

## 0.1.3

- Correctly highlight search terms whose matches overlap.
- Add React 15 to the supported `react` peer dependency range.

## 0.1.2

- Add `highlightStyle` prop.

## 0.1.1

- Rename the package to `react-highlight-words` to avoid an npm name conflict.

## 0.1.0

- Initial release.
