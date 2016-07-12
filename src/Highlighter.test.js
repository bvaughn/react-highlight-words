import React from 'react'
import Highlighter from './Highlighter'
import { render } from './test-utils'
import expect from 'expect.js'
import latinize from 'latinize'

describe('Highlighter', () => {
  const HIGHLIGHT_CLASS = 'customHighlightClass'
  const HIGHLIGHT_QUERY_SELECTOR = `.${HIGHLIGHT_CLASS}`

  function getHighlighterChildren (textToHighlight, searchWords, highlightStyle, preCompare) {
    const node = render(
      <div>
        <Highlighter
          highlightClassName={HIGHLIGHT_CLASS}
          highlightStyle={highlightStyle}
          searchWords={searchWords}
          textToHighlight={textToHighlight}
          preCompare={preCompare}
        />
      </div>
    )

    return node.children[0]
  }

  it('should properly handle empty searchText', () => {
    const emptyValues = [[], ['']]
    emptyValues.forEach((emptyValue) => {
      const node = getHighlighterChildren('This is text', emptyValue)
      expect(node.children.length).to.equal(1)
      expect(node.querySelectorAll(HIGHLIGHT_QUERY_SELECTOR).length).to.equal(0)
      expect(node.textContent).to.eql('This is text')
    })
  })

  it('should properly handle empty textToHighlight', () => {
    const node = getHighlighterChildren('', ['search'])
    expect(node.children.length).to.equal(0)
    expect(node.querySelectorAll(HIGHLIGHT_QUERY_SELECTOR).length).to.equal(0)
    expect(node.textContent).to.eql('')
  })

  it('should highlight searchText words that exactly match words in textToHighlight', () => {
    const node = getHighlighterChildren('This is text', ['text'])
    expect(node.children.length).to.equal(2)
    const matches = node.querySelectorAll(HIGHLIGHT_QUERY_SELECTOR)
    expect(matches.length).to.equal(1)
    expect(matches[0].textContent).to.eql('text')
  })

  it('should highlight searchText words that partial-match text in textToHighlight', () => {
    const node = getHighlighterChildren('This is text', ['Th'])
    expect(node.children.length).to.equal(2)
    const matches = node.querySelectorAll(HIGHLIGHT_QUERY_SELECTOR)
    expect(matches.length).to.equal(1)
    expect(matches[0].textContent).to.eql('Th')
    expect(node.children[0].textContent).to.equal('Th')
    expect(node.children[1].textContent).to.equal('is is text')
  })

  it('should highlight multiple occurrences of a searchText word', () => {
    const node = getHighlighterChildren('This is text', ['is'])
    expect(node.children.length).to.equal(5)
    expect(node.querySelectorAll(HIGHLIGHT_QUERY_SELECTOR).length).to.equal(2)
    expect(node.textContent).to.eql('This is text')
    expect(node.children[0].textContent).to.equal('Th')
    expect(node.children[1].textContent).to.equal('is')
    expect(node.children[2].textContent).to.equal(' ')
    expect(node.children[3].textContent).to.equal('is')
    expect(node.children[4].textContent).to.equal(' text')
  })

  it('should highlight multiple searchText words', () => {
    const node = getHighlighterChildren('This is text', ['This', 'text'])
    expect(node.children.length).to.equal(3)
    expect(node.querySelectorAll(HIGHLIGHT_QUERY_SELECTOR).length).to.equal(2)
    expect(node.textContent).to.eql('This is text')
    expect(node.children[0].textContent).to.equal('This')
    expect(node.children[1].textContent).to.equal(' is ')
    expect(node.children[2].textContent).to.equal('text')
  })

  it('should match terms in a case insensitive way but show their case-sensitive representation', () => {
    const node = getHighlighterChildren('This is text', ['this'])
    const matches = node.querySelectorAll(HIGHLIGHT_QUERY_SELECTOR)
    expect(matches.length).to.equal(1)
    expect(matches[0].textContent).to.equal('This')
  })

  it('should use the :highlightClassName if specified', () => {
    const node = getHighlighterChildren('This is text', ['text'])
    expect(node.querySelector('mark').className).to.contain(HIGHLIGHT_CLASS)
  })

  it('should use the :highlightStyle if specified', () => {
    const node = getHighlighterChildren('This is text', ['text'], { color: 'red' })
    expect(node.querySelector('mark').style.color).to.contain('red')
  })

  it('should match terms without accents against text with accents', () => {
    const node = getHighlighterChildren('ỆᶍǍᶆṔƚÉ', ['example'], null, latinize)
    const matches = node.querySelectorAll(HIGHLIGHT_QUERY_SELECTOR)
    expect(matches.length).to.equal(1)
    expect(matches[0].textContent).to.equal('ỆᶍǍᶆṔƚÉ')
  })
})
