/* @flow */
import React, { PropTypes } from 'react'
import styles from './Highlighter.css'
import * as Chunks from './utils.js'

Highlighter.propTypes = {
  highlightClassName: PropTypes.string,
  highlightStyle: PropTypes.object,
  searchWords: PropTypes.arrayOf(PropTypes.string).isRequired,
  textToHighlight: PropTypes.string.isRequired
}

/**
 * Highlights all occurrences of search terms (searchText) within a string (textToHighlight).
 * This function returns an array of strings and <span>s (wrapping highlighted words).
 */
export default function Highlighter ({
  highlightClassName = '',
  highlightStyle = {},
  searchWords,
  textToHighlight }
) {
  const chunks = Chunks.findAll(textToHighlight, searchWords)
  const highlightClassNames = `${styles.Term} ${highlightClassName}`

  return (
    <span>
      {chunks.map((chunk, index) => {
        const text = textToHighlight.substr(chunk.start, chunk.end - chunk.start)

        if (chunk.highlight) {
          return (
            <mark
              className={highlightClassNames}
              key={index}
              style={highlightStyle}
            >
              {text}
            </mark>
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
