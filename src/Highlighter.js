/* @flow */
import React, { PropTypes } from 'react'
import styles from './Highlighter.css'
import * as Chunks from './utils.js'

Highlighter.propTypes = {
  highlightClassName: PropTypes.string,
  searchWords: PropTypes.arrayOf(PropTypes.string).isRequired,
  textToHighlight: PropTypes.string.isRequired
}

/**
 * Highlights all occurrences of search terms (searchText) within a string (textToHighlight).
 * This function returns an array of strings and <span>s (wrapping highlighted words).
 */
export default function Highlighter ({
  highlightClassName = '',
  searchWords,
  textToHighlight }
) {
  const chunks = Chunks.findAll(searchWords, textToHighlight)
  const highlightClassNames = `${styles.Term} ${highlightClassName}`
  let uidCounter = 0
  const content = chunks.map((chunk) =>
    <span
      key={++uidCounter}
      className={chunk.highlight ? highlightClassNames : ''}
      >
        {textToHighlight.substr(chunk.start, chunk.end - chunk.start)}
    </span>
  )

  return (
    <span>
      {content}
    </span>
  )
}
