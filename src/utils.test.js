import * as Chunks from './utils.js'
import expect from 'expect.js'

describe('utils', () => {
  // Positions: 01234567890123456789012345678901234567
  const TEXT = 'This is a string with words to search.'

  it('should highlight all occurrences of a word, regardless of capitalization', () => {
    const rawChunks = Chunks.findChunks(TEXT, ['th'])
    expect(rawChunks).to.eql([
      {start: 0, end: 2},
      {start: 19, end: 21}
    ])
  })

  it('should highlight words that partially overlap', () => {
    const combinedChunks = Chunks.combineChunks(
      Chunks.findChunks(TEXT, ['thi', 'is'])
    )
    expect(combinedChunks).to.eql([
      {start: 0, end: 4},
      {start: 5, end: 7}
    ])
  })

  it('should combine into the minimum number of marked and unmarked chunks', () => {
    const filledInChunks = Chunks.findAll(TEXT, ['thi', 'is'])
    expect(filledInChunks).to.eql([
      {start: 0, end: 4, highlight: true},
      {start: 4, end: 5, highlight: false},
      {start: 5, end: 7, highlight: true},
      {start: 7, end: 38, highlight: false}
    ])
  })
})
