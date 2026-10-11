<img src="https://react-highlight-words.vercel.app/og.png" alt="react-highlight-words logo" width="400" height="210" />

React component to highlight words within a larger body of text.

## Installation

Begin by installing the library from NPM:

```sh
npm install react-highlight-words
```

## TypeScript types

TypeScript definitions are included within the published `dist` folder.

## Documentation

Documentation and examples for this project are available at [react-highlight-words.vercel.app](https://react-highlight-words.vercel.app/).

## Usage

To use it, just provide it with an array of search terms and a body of text to highlight.

```tsx
import Highlighter from "react-highlight-words";

function Example() {
  return (
    <Highlighter
      highlightClassName="YourHighlightClass"
      searchWords={["and", "or", "the"]}
      textToHighlight="The dog is chasing the cat. Or perhaps they're just playing?"
    />
  );
}
```

And the `Highlighter` will mark all occurrences of search terms within the text:

<img width="368" alt="screen shot 2015-12-19 at 8 23 43 am" src="https://cloud.githubusercontent.com/assets/29597/11914033/e3c319f6-a629-11e5-896d-1a5ce22c9ea2.png">

### Highlighter

<!-- Highlighter:description:begin -->
Highlights all occurrences of one or more search terms within a larger body of text.

Highlighted matches are wrapped in a `<mark>` element by default, and unhighlighted text is wrapped in a `<span>`.
Both of these can be customized with the `highlightTag` and `unhighlightTag` props.

ℹ️ Any other props (such as `title` or `data-*` attributes) are applied to the outer/wrapper `<span>`, and a `ref` is forwarded to it.
<!-- Highlighter:description:end -->

#### Required props

<!-- Highlighter:required-props:begin -->

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>searchWords</td>
      <td><p>Array of search words.
String search terms are matched literally, unless <code>autoEscape</code> is false
(in which case they are treated as regular expressions, and strings that aren&#39;t valid regular expressions are matched literally).
RegExp search terms are used as-is (with their own flags).</p>
</td>
    </tr>
    <tr>
      <td>textToHighlight</td>
      <td><p>Text to highlight matches in.</p>
<p>ℹ️ Browsers collapse whitespace and newlines by default; to preserve them, set the <code>white-space</code> style (e.g. <code>style={{ whiteSpace: &quot;pre-wrap&quot; }}</code>).</p>
</td>
    </tr>
  </tbody>
</table>

<!-- Highlighter:required-props:end -->

#### Optional props

<!-- Highlighter:optional-props:begin -->

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>className</td>
      <td><p>Class name applied to the outer/wrapper <code>&lt;span&gt;</code>.</p>
</td>
    </tr>
    <tr>
      <td>activeClassName</td>
      <td><p>Class name applied to the active match.</p>
<p>ℹ️ Use along with <code>activeIndex</code>.</p>
</td>
    </tr>
    <tr>
      <td>activeIndex</td>
      <td><p>Index of the match that should be actively highlighted.</p>
<p>ℹ️ Use along with <code>activeClassName</code> or <code>activeStyle</code>.</p>
</td>
    </tr>
    <tr>
      <td>activeStyle</td>
      <td><p>Inline styles applied to the active match.</p>
<p>ℹ️ Use along with <code>activeIndex</code>.</p>
</td>
    </tr>
    <tr>
      <td>autoEscape</td>
      <td><p>Match string search terms literally (defaults to <code>true</code>).
Set to <code>false</code> to treat them as regular expressions.
(They are compiled without the <code>u</code> flag, so syntax that requires it, such as <code>\p{L}</code>, only works in RegExp search terms.)</p>
<p>⚠️ Only set this to <code>false</code> for trusted search terms;
a malicious regular expression can take an extremely long time to run.</p>
</td>
    </tr>
    <tr>
      <td>caseSensitive</td>
      <td><p>Match string search terms case sensitively.
RegExp search terms are case sensitive unless they have the <code>i</code> flag.</p>
</td>
    </tr>
    <tr>
      <td>findChunks</td>
      <td><p>Custom function to search for matching chunks.
This makes it possible to use arbitrary logic when looking for matches.</p>
<p>It receives the search options (with defaults applied) and returns the <code>start</code> and <code>end</code> index of each range of text to highlight,
along with the <code>searchIndex</code> of the search word that matched it.
Overlapping ranges are combined automatically.</p>
<p>See the default <code>findChunks</code> function in <a href="https://github.com/bvaughn/highlight-words-core">highlight-words-core</a> for reference.</p>
</td>
    </tr>
    <tr>
      <td>highlightClassName</td>
      <td><p>Class name applied to highlighted text,
or an object mapping search term matches to class names.</p>
<p>ℹ️ Object keys are compared with the matched text first, then with the string search term that matched it
(case insensitively, unless <code>caseSensitive</code> is true).</p>
</td>
    </tr>
    <tr>
      <td>highlightStyle</td>
      <td><p>Inline styles applied to highlighted text.</p>
</td>
    </tr>
    <tr>
      <td>highlightTag</td>
      <td><p>Type of tag to wrap around highlighted matches.
Defaults to <code>mark</code> but can also be a React component (class or function).</p>
<p>ℹ️ Custom components will receive <code>children</code>, <code>className</code>, <code>highlightIndex</code>, <code>searchIndex</code>, and <code>style</code> props.</p>
</td>
    </tr>
    <tr>
      <td>sanitize</td>
      <td><p>Process each string search word and the text to highlight before comparing (e.g. to remove accents).
Matches always refer to the original text, even if sanitizing changes its length (e.g. &quot;Æ&quot; to &quot;AE&quot;).</p>
<p>ℹ️ Sanitizing should transform characters independently;
if it changes the text, it is applied to each character separately.
RegExp search terms are not sanitized, but they are matched against the sanitized text.</p>
</td>
    </tr>
    <tr>
      <td>unhighlightClassName</td>
      <td><p>Class name applied to unhighlighted text.</p>
</td>
    </tr>
    <tr>
      <td>unhighlightStyle</td>
      <td><p>Inline styles applied to unhighlighted text.</p>
</td>
    </tr>
    <tr>
      <td>unhighlightTag</td>
      <td><p>Type of tag applied to unhighlighted parts of the text.
Defaults to <code>span</code> but can also be a React component (class or function).</p>
</td>
    </tr>
  </tbody>
</table>

<!-- Highlighter:optional-props:end -->

### Custom highlight tag

By default, this component uses an HTML Mark Text element (`<mark>`) to wrap matched text, but you can inject a custom
tag using the `highlightTag` property. This tag should be a React component that accepts the following properties:

| Property         | Type   | Description            |
| ---------------- | ------ | ---------------------- |
| `children`       | String | Text to be highlighted |
| `className`      | String | Class name(s) to apply |
| `highlightIndex` | Number | Index of matched text  |
| `searchIndex`    | Number | Index of the matching search word |
| `style`          | Object | Inline styles to apply |

For example:

```tsx
import { type HighlightTagProps } from "react-highlight-words";

function Highlight({ children, highlightIndex }: HighlightTagProps) {
  return <strong className="highlighted-text">{children}</strong>;
}
```

## License

MIT License - fork, modify and use however you want.
