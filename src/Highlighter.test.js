import Highlighter from './Highlighter'
import expect from 'expect.js'

describe('Highlighter', () => {
  function getHighlighterChildren (textToHighlight, searchWords, highlightClassName, highlightStyle) {
    const instance = Highlighter({
      highlightClassName,
      highlightStyle,
      textToHighlight,
      searchWords
    })

    return instance.props.children
  }

  it('should properly handle empty searchText', () => {
    expect(getHighlighterChildren('This is text', [])).to.eql(['This is text'])
    expect(getHighlighterChildren('This is text', [''])).to.eql(['This is text'])
  })

  it('should properly handle empty textToHighlight', () => {
    expect(getHighlighterChildren('', ['search']).length).to.eql([])
  })

  it('should highlight searchText words that exactly match words in textToHighlight', () => {
    const matches = getHighlighterChildren('This is text', ['text'])
    expect(matches.length).to.equal(2)
    expect(matches[0]).to.equal('This is ')
    expect(matches[1].props.children).to.equal('text')
  })

  it('should highlight searchText words that partial-match text in textToHighlight', () => {
    const matches = getHighlighterChildren('This is text', ['Th'])
    expect(matches.length).to.equal(2)
    expect(matches[0].props.children).to.equal('Th')
    expect(matches[1]).to.equal('is is text')
  })

  it('should highlight multiple occurrences of a searchText word', () => {
    const matches = getHighlighterChildren('This is text', ['is'])
    expect(matches.length).to.equal(5)
    expect(matches[0]).to.equal('Th')
    expect(matches[1].props.children).to.equal('is')
    expect(matches[2]).to.equal(' ')
    expect(matches[3].props.children).to.equal('is')
    expect(matches[4]).to.equal(' text')
  })

  it('should highlight multiple searchText words', () => {
    const matches = getHighlighterChildren('This is text', ['This', 'text'])
    expect(matches.length).to.equal(3)
    expect(matches[0].props.children).to.equal('This')
    expect(matches[1]).to.equal(' is ')
    expect(matches[2].props.children).to.equal('text')
  })

  it('should match terms in a case insensitive way but show their case-sensitive representation', () => {
    const matches = getHighlighterChildren('This is text', ['this'])
    expect(matches.length).to.equal(2)
    expect(matches[0].props.children).to.equal('This')
    expect(matches[1]).to.equal(' is text')
  })

  it('should use the :highlightClassName if specified', () => {
    const matches = getHighlighterChildren('This is text', ['text'], 'customClass')
    expect(matches.length).to.equal(2)
    expect(matches[1].props.className).to.contain('customClass')
  })

  it('should use the :highlightStyle if specified', () => {
    const matches = getHighlighterChildren('This is text', ['text'], undefined, { color: 'red' })
    expect(matches[1].props.style.color).to.contain('red')
  })
})
