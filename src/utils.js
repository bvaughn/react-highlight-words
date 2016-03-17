/**
 * Creates an array of chunk objects representing both higlightable and non highlightable pieces of text that match each search word.
 * @param searchWords string[]
 * @param text string
 * @return {start:number, end:number, highlight:boolean}[]
 */
export const findAll = (searchWords, text) =>
  fillInChunks(
    combineChunks(
      findChunks(text, searchWords)
    ),
    text.length
  )

/**
 * Takes an array of {start:number, end:number} objects and combines chunks that overlap into single chunks.
 * @param chunks {start:number, end:number}[]
 * @return {start:number, end:number}[]
 */
export const combineChunks = (chunks) => {
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
          // It may be the case that prevChunk completely surrounds nextChunk, so take the
          // largest of the end indeces.
          const endIndex = Math.max(prevChunk.end, nextChunk.end)
          processedChunks.push({start: prevChunk.start, end: endIndex})
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
 * @param textToSearch string
 * @param wordsToFind string[]
 * @return {start:number, end:number}[]
 */
export const findChunks = (textToSearch, wordsToFind) =>
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
 * Given a set of chunks to highlight, create an additional set of chunks
 * to represent the bits of text between the highlighted text.
 * @param chunksToHighlight {start:number, end:number}[]
 * @param totalLength number
 * @return {start:number, end:number, highlight:boolean}[]
 */
export const fillInChunks = (chunksToHighlight, totalLength) => {
  const allChunks = []
  const append = (start, end, highlight) => allChunks.push({start: start, end: end, highlight: highlight})

  if (chunksToHighlight.length == 0) {
    append(0, totalLength, false);
  } else {
    let lastIndex = 0
    chunksToHighlight.forEach((chunk) => {
      append(lastIndex, chunk.start, false)
      append(chunk.start, chunk.end, true)
      lastIndex = chunk.end
    })
    append(lastIndex, totalLength, false)
  }
  return allChunks
}
