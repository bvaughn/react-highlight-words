/* @flow */
import { findAll } from 'highlight-words-core'
import React, { PropTypes } from 'react'

Highlighter.propTypes = {
  autoEscape: PropTypes.bool,
  highlightClassName: PropTypes.string,
  highlightTag: PropTypes.string,
  highlightStyle: PropTypes.object,
  searchWords: PropTypes.arrayOf(PropTypes.string).isRequired,
  textToHighlight: PropTypes.string.isRequired,
  sanitize: PropTypes.func,
  activeHighlightIndex: PropTypes.string,
  activeHighlightClassName: PropTypes.string
}

/**
 * Highlights all occurrences of search terms (searchText) within a string (textToHighlight).
 * This function returns an array of strings and <span>s (wrapping highlighted words).
 */
export default function Highlighter ({
  autoEscape,
  highlightClassName = '',
  highlightStyle = {},
  highlightTag = 'mark',
  searchWords,
  textToHighlight,
  sanitize,
  activeHighlightIndex = -1,
  activeHighlightClassName = ''
}) {
  const chunks = findAll({
    autoEscape,
    sanitize,
    searchWords,
    textToHighlight
  })
  const HighlightTag = highlightTag
  let highlightCount = -1
  let highlightClassNames = ''

  return (
    <span>
      {chunks.map((chunk, index) => {
        const text = textToHighlight.substr(chunk.start, chunk.end - chunk.start)

        if (chunk.highlight) {
          highlightCount++
          highlightClassNames = `${highlightClassName} ${highlightCount === +activeHighlightIndex ? activeHighlightClassName : ''}`

          return (
            <HighlightTag
              className={highlightClassNames}
              key={index}
              style={highlightStyle}
            >
              {text}
            </HighlightTag>
          )
        } else {
          return (
            <span key={index}>{text}</span>
          )
        }
      })}
    </span>
  )
}
