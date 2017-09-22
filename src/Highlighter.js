/* @flow */
import { findAll } from 'highlight-words-core'
import PropTypes from 'prop-types'
import React from 'react'

Highlighter.propTypes = {
  activeClassName: PropTypes.string,
  activeStyle: PropTypes.object,
  activeIndex: PropTypes.number,
  autoEscape: PropTypes.bool,
  className: PropTypes.string,
  highlightClassName: PropTypes.string,
  highlightStyle: PropTypes.object,
  highlightTag: PropTypes.string,
  sanitize: PropTypes.func,
  searchWords: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      word: PropTypes.string.isRequired,
      style: PropTypes.object.isRequired
    })
  ])).isRequired,
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
  activeStyle = {},
  activeIndex = -1,
  autoEscape,
  className,
  highlightClassName = '',
  highlightStyle = {},
  highlightTag = 'mark',
  sanitize,
  searchWords,
  textToHighlight,
  unhighlightClassName = '',
  unhighlightStyle
}) {
  const searchWordsArray = searchWords.map(wordElement => {
    if (typeof wordElement === 'string') return wordElement

    return wordElement.word
  })
  const searchWordsStyleMap = searchWords.reduce((acc, wordElement) => {
    if (typeof wordElement === 'string') {
      acc[wordElement] = {}
    } else {
      acc[wordElement.word] = wordElement.style
    }

    return acc
  }, {})
  const chunks = findAll({
    autoEscape,
    sanitize,
    searchWords: searchWordsArray,
    textToHighlight
  })
  const HighlightTag = highlightTag
  let highlightCount = -1
  let highlightClassNames = ''
  let highlightStyleMerged = {}

  return (
    <span className={className}>
      {chunks.map((chunk, index) => {
        const text = textToHighlight.substr(chunk.start, chunk.end - chunk.start)

        if (chunk.highlight) {
          highlightCount++
          const isActive = highlightCount === +activeIndex
          highlightClassNames = `${highlightClassName} ${isActive ? activeClassName : ''}`
          highlightStyleMerged = Object.assign({}, highlightStyle, searchWordsStyleMap[text], isActive ? activeStyle : {})

          return (
            <HighlightTag
              className={highlightClassNames}
              key={index}
              style={highlightStyleMerged}
            >
              {text}
            </HighlightTag>
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
