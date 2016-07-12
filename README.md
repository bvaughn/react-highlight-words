<img src="https://cloud.githubusercontent.com/assets/29597/11913937/0d2dcd78-a629-11e5-83e7-6a17b6d765a5.png" width="260" height="260">

React component to highlight words within a larger body of text.

Check out a demo [here](https://bvaughn.github.io/react-highlight-words).

## Usage

To use it, just provide it with an array of search terms and a body of text to highlight:

```html
<Highlighter
  highlightClassName='YourHighlightClass'
  searchWords={['and', 'or', 'the']}
  textToHighlight="The dog is chasing the cat. Or perhaps they're just playing?"
/>
```

And the `Highlighter` will mark all occurrences of search terms within the text:

<img width="368" alt="screen shot 2015-12-19 at 8 23 43 am" src="https://cloud.githubusercontent.com/assets/29597/11914033/e3c319f6-a629-11e5-896d-1a5ce22c9ea2.png">

## Props

| Property | Type | Required? | Description |
|:---|:---|:---:|:---|
| highlightClassName | String |  | CSS class name applied to highlighted text |
| highlightStyle | Object |  | Inline styles applied to highlighted text |
| sanitize | Function |  | Process each search word and text to highlight before comparing (eg remove accents); signature `(text: string): string` |
| searchWords | Array<String> | ✓ | Array of search words |
| textToHighlight | String | ✓ | Text to highlight matches in |

## Installation
```
npm i --save react-highlight-words
```

## License
MIT License - fork, modify and use however you want.
