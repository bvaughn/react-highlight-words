/* @flow */
import React, { PropTypes } from 'react'
import styles from './Highlighter.css'

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
  const highlightClassNames = `${styles.Term} ${highlightClassName}`
  let uidCounter = 0
  const content = searchWords
    .filter(searchWord => searchWord) // Remove empty words
    .reduce((substrings, searchWord) => {
      const searchWordLength = searchWord.length
      const regex = new RegExp(searchWord, 'gi')

      // Step backwards so that changes to the Array won't cause us to visit the same text twice.
      for (var i = substrings.length - 1; i >= 0; i--) {
        let substring = substrings[i]

        // Examine the current substring for any marker-matches.
        // If we find matches, replace the plain text string with a styled <span> wrapper.
        // If this element of the array already contains a styled <span> we can ignore it.
        // There is no benefit to highlighting text twice.
        // (This means that only one of a pair of overlapping words will be highlighted, but that's okay.)
        if (typeof substring === 'string') {
          let substringReplacements = []
          let startIndex

          while ((startIndex = substring.search(regex)) >= 0) {
            if (startIndex > 0) {
              substringReplacements.push(substring.substring(0, startIndex))
            }

            let endIndex = startIndex + searchWordLength

            substringReplacements.push(
              <span
                key={++uidCounter}
                className={highlightClassNames}
              >
                {substring.substring(startIndex, endIndex)}
              </span>
            )

            substring = substring.substring(endIndex)
          }

          // If we didn't find any matches then just leave the current substring as-is.
          if (substringReplacements.length) {
            // Add any remaining text
            if (substring.length) {
              substringReplacements.push(substring)
            }

            // Replace the existing string element with the new mix of plain and styled elements.
            substrings.splice(i, 1, ...substringReplacements)
          }
        }
      }

      return substrings
    }, [textToHighlight])

  return (
    <span>
      {content}
    </span>
  )
}
