/* @flow */
import { findAll } from 'highlight-words-core'
import PropTypes from 'prop-types'
import React from 'react'

Highlighter.propTypes = {
  activeClassName: PropTypes.string,
  activeIndex: PropTypes.number,
  autoEscape: PropTypes.bool,
  className: PropTypes.string,
  highlightClassName: PropTypes.string,
  highlightStyle: PropTypes.object,
  highlightTag: PropTypes.string,
  highlightWrapper: PropTypes.func,
  sanitize: PropTypes.func,
  searchWords: PropTypes.arrayOf(PropTypes.string).isRequired,
  textToHighlight: PropTypes.string.isRequired,
  unhighlightClassName: PropTypes.string,
  unhighlightStyle: PropTypes.object
}

/**
 * Highlights all occurrences of search terms (searchText) within a string (textToHighlight).
 * This function returns an array of strings and <span>s (wrapping highlighted words).
 */
export default function Highlighter ({
  activeClassName = '',
  activeIndex = -1,
  autoEscape,
  className,
  highlightClassName = '',
  highlightStyle = {},
  highlightTag = 'mark',
  highlightWrapper = ({ children }) => children,
  sanitize,
  searchWords,
  textToHighlight,
  unhighlightClassName = '',
  unhighlightStyle
}) {
  const chunks = findAll({
    autoEscape,
    sanitize,
    searchWords,
    textToHighlight
  })
  const HighlightTag = highlightTag
  const HighlightWrapper = highlightWrapper;
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
            <HighlightWrapper>
              <HighlightTag
                className={highlightClassNames}
                key={index}
                style={highlightStyle}
              >
                {text}
              </HighlightTag>
            </HighlightWrapper>
          )
        } else {
          return (
            <span
              className={unhighlightClassName}
              key={index}
              style={unhighlightStyle}
            >
              {text}
            </span>
          )
        }
      })}
    </span>
  )
}
