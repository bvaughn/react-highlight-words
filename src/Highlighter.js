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
  const chunks = Chunks.findAll(searchWords, textToHighlight)
  const highlightClassNames = `${styles.Term} ${highlightClassName}`

  return (
    <span>
      {chunks.map((chunk, index) =>
      <span
        key={index}
        className={chunk.highlight ? highlightClassNames : ''}
        >
          {textToHighlight.substr(chunk.start, chunk.end - chunk.start)}
      </span>
    )}
    </span>
  )
}
