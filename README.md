<img src="https://cloud.githubusercontent.com/assets/29597/11913937/0d2dcd78-a629-11e5-83e7-6a17b6d765a5.png" width="260" height="260">

React component to highlight words within a larger body of text.

Check out a demo [here](https://bvaughn.github.io/react-highlight-words).

## Usage

To use it, just provide it with an array of search terms and a body of text to highlight:

```html
<Highlighter
  highlightClassName='YourHighlightClass'
  searchWords={['and', 'or', 'the']}
  autoEscape={true}
  textToHighlight="The dog is chasing the cat. Or perhaps they're just playing?"
/>
```

And the `Highlighter` will mark all occurrences of search terms within the text:

<img width="368" alt="screen shot 2015-12-19 at 8 23 43 am" src="https://cloud.githubusercontent.com/assets/29597/11914033/e3c319f6-a629-11e5-896d-1a5ce22c9ea2.png">

## Props

| Property | Type | Required? | Description |
|:---|:---|:---:|:---|
| activeClassName | String |  | The class name to be applied to an active match. Use along with `activeIndex` |
| activeIndex | String |  | Specify the match index that should be actively highlighted. Use along with `activeClassName` |
| activeStyle | Object |  | The inline style to be applied to an active match. Use along with `activeIndex` |
| autoEscape | Boolean |  | Escape characters in `searchWords` which are meaningful in regular expressions |
| className | String |  | CSS class name applied to the outer/wrapper `<span>` |
| caseSensitive | Boolean |  | Search should be case sensitive; defaults to `false` |
| findChunks | Function |  | Use a custom function to search for matching chunks. This makes it possible to use arbitrary logic when looking for matches; see the default `findChunks` function in [highlight-words-core](https://github.com/bvaughn/highlight-words-core) for signature |
| highlightClassName | String |  | CSS class name applied to highlighted text |
| highlightStyle | Object |  | Inline styles applied to highlighted text |
| highlightTag | Node |  | Type of tag to wrap around highlighted matches; defaults to `mark` but can also be a React element (class or functional) |
| sanitize | Function |  | Process each search word and text to highlight before comparing (eg remove accents); signature `(text: string): string` |
| searchWords | Array<String> | ✓ | Array of search words. The search terms are treated as RegExps unless `autoEscape` is set. |
| textToHighlight | String | ✓ | Text to highlight matches in |
| unhighlightClassName | String |  | CSS class name applied to unhighlighted text |
| unhighlightStyle | Object |  | Inline styles applied to unhighlighted text |

## Installation
```
npm i --save react-highlight-words
```

## License
MIT License - fork, modify and use however you want.
