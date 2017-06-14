/* @flow */
import { findAll } from 'highlight-words-core'
import PropTypes from 'prop-types'
import React from 'react'

Highlighter.propTypes = {
  inactiveClassName: PropTypes.string,
  activeClassName: PropTypes.string,
  activeIndex: PropTypes.string,
  autoEscape: PropTypes.bool,
  className: PropTypes.string,
  highlightClassName: PropTypes.string,
  highlightTag: PropTypes.string,
  highlightStyle: PropTypes.object,
  searchWords: PropTypes.arrayOf(PropTypes.string).isRequired,
  textToHighlight: PropTypes.string.isRequired,
  sanitize: PropTypes.func
}

/**
 * Highlights all occurrences of search terms (searchText) within a string (textToHighlight).
 * This function returns an array of strings and <span>s (wrapping highlighted words).
 */
export default function Highlighter ({
  inactiveClassName = '',
  activeClassName = '',
  activeIndex = -1,
  autoEscape,
  className,
  highlightClassName = '',
  highlightStyle = {},
  highlightTag = 'mark',
  searchWords,
  textToHighlight,
  sanitize
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
    <span className={className}>
      {chunks.map((chunk, index) => {
        const text = textToHighlight.substr(chunk.start, chunk.end - chunk.start)

        if (chunk.highlight) {
          highlightCount++
          highlightClassNames = `${highlightClassName} ${highlightCount === +activeIndex ? activeClassName : ''}`

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
            <span key={index} className={inactiveClassName}>{text}</span>
          )
        }
      })}
    </span>
  )
}
