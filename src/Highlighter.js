/* @flow */
import { findAll } from 'highlight-words-core'
import { createElement } from 'react'
import memoizeOne from 'memoize-one'

/**
 * Highlighter component
 * @param {object} props - Component properties
 * @param {string} [props.activeClassName] - The class name to be applied to an active match. Use along with `activeIndex`.
 * @param {number} [props.activeIndex] - Specify the match index that should be actively highlighted. Use along with `activeClassName`.
 * @param {object} [props.activeStyle] - The inline style to be applied to an active match. Use along with `activeIndex`.
 * @param {boolean} [props.autoEscape] - Escape characters in searchWords which are meaningful in regular expressions.
 * @param {string} [props.className] - CSS class name applied to the outer/wrapper `<span>`.
 * @param {(options: object) => Array<{start: number, end: number}>} [props.findChunks] - Use a custom function to search for matching chunks.  See the default `findChunks` function in `highlight-words-core` for signature.
 * @param {string|object} [props.highlightClassName] - CSS class name applied to highlighted text or object mapping search term matches to class names.
 * @param {object} [props.highlightStyle] - Inline styles applied to highlighted text.
 * @param {React.ComponentType|string} [props.highlightTag] - Type of tag to wrap around highlighted matches. Defaults to `mark` but can also be a React component (class or functional).
 * @param {(text: string) => string} [props.sanitize] - Process each search word and text to highlight before comparing.
 * @param {Array<string|RegExp>} props.searchWords - Array of search words. String search terms are automatically cast to RegExps unless `autoEscape` is true.
 * @param {string} props.textToHighlight - The text to highlight matches in.
 * @param {React.ComponentType|string} [props.unhighlightTag] - Type of tag applied to unhighlighted parts. Defaults to `span` but can also be a React component (class or functional).
 * @param {string} [props.unhighlightClassName] - CSS class name applied to unhighlighted text.
 * @param {object} [props.unhighlightStyle] - Inline styles applied to the unhighlighted text.
 * @param {object} [props.rest] - Additional attributes passed to the outer `<span>` element.
 */
export default function Highlighter ({
  activeClassName = '',
  activeIndex = -1,
  activeStyle,
  autoEscape,
  caseSensitive = false,
  className,
  findChunks,
  highlightClassName = '',
  highlightStyle = {},
  highlightTag = 'mark',
  sanitize,
  searchWords,
  textToHighlight,
  unhighlightTag = 'span',
  unhighlightClassName = '',
  unhighlightStyle,
  ...rest
}) {
  const chunks = findAll({
    autoEscape,
    caseSensitive,
    findChunks,
    sanitize,
    searchWords,
    textToHighlight
  })
  const HighlightTag = highlightTag
  let highlightIndex = -1
  let highlightClassNames = ''
  let highlightStyles

  const lowercaseProps = object => {
    const mapped = {}
    for (let key in object) {
      mapped[key.toLowerCase()] = object[key]
    }
    return mapped
  }
  const memoizedLowercaseProps = memoizeOne(lowercaseProps)

  return createElement('span', {
    className,
    ...rest,
    children: chunks.map((chunk, index) => {
      const text = textToHighlight.substring(chunk.start, chunk.end)

      if (chunk.highlight) {
        highlightIndex++

        let highlightClass
        if (typeof highlightClassName === 'object') {
          if (!caseSensitive) {
            highlightClassName = memoizedLowercaseProps(highlightClassName)
            highlightClass = highlightClassName[text.toLowerCase()]
          } else {
            highlightClass = highlightClassName[text]
          }
        } else {
          highlightClass = highlightClassName
        }

        const isActive = highlightIndex === +activeIndex

        highlightClassNames = `${highlightClass} ${isActive ? activeClassName : ''}`
        highlightStyles = isActive === true && activeStyle != null
          ? Object.assign({}, highlightStyle, activeStyle)
          : highlightStyle

        const props = {
          children: text,
          className: highlightClassNames,
          key: index,
          style: highlightStyles
        }

        // Don't attach arbitrary props to DOM elements; this triggers React DEV warnings (https://fb.me/react-unknown-prop)
        // Only pass through the highlightIndex attribute for custom components.
        if (typeof HighlightTag !== 'string') {
          props.highlightIndex = highlightIndex
        }

        return createElement(HighlightTag, props)
      } else {
        return createElement(unhighlightTag, {
          children: text,
          className: unhighlightClassName,
          key: index,
          style: unhighlightStyle
        })
      }
    })
  })
}
