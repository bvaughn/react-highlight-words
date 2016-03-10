/* @flow */
import React, { PropTypes } from 'react'
import styles from './Highlighter.css'

Highlighter.propTypes = {
  highlightClassName: PropTypes.string,
  searchWords: PropTypes.arrayOf(PropTypes.string).isRequired,
  textToHighlight: PropTypes.string.isRequired
}

/**
 * Takes an array of {start:number, end:number} objects and combines chunks that overlap into single chunks.
 */
const combineChunks = (chunks) => {
  chunks = chunks
    .sort((first, second) => first.start - second.start)
    .reduce((processedChunks, nextChunk) => {
      // First chunk just goes straight in the array...
      if (processedChunks.length === 0) {
        return [nextChunk]
      } else {
        // ... subsequent chunks get checked to see if they overlap...
        const prevChunk = processedChunks.pop()
        if (nextChunk.start <= prevChunk.end) {
          processedChunks.push({start: prevChunk.start, end: nextChunk.end})
        } else {
          processedChunks.push(prevChunk, nextChunk)
        }
        return processedChunks
      }
    }, [])

  return chunks
}

/**
 * Examine textToSearch for any matches.
 * If we find matches, add them to the returned array as a "chunk" object ({start:number, end:number}).
 */
const findChunks = (textToSearch, wordsToFind) =>
  wordsToFind
    .filter(searchWord => searchWord) // Remove empty words
    .reduce((chunks, searchWord) => {
        const regex = new RegExp(searchWord, 'gi')
        let match
        while ((match = regex.exec(textToSearch)) != null) {
          chunks.push({start: match.index, end: regex.lastIndex})
        }
        return chunks
    }, [])

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
