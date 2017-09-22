import React from 'react'
import Highlighter from './Highlighter'
import { render } from './test-utils'
import expect from 'expect.js'
import latinize from 'latinize'

describe('Highlighter', () => {
  const HIGHLIGHT_CLASS = 'customHighlightClass'
  const HIGHLIGHT_QUERY_SELECTOR = `.${HIGHLIGHT_CLASS}`
  const UNHIGHLIGHT_CLASS = 'customUnhighlightClass'

  function getHighlighterChildren ({
    autoEscape,
    activeClassName,
    activeStyle,
    activeIndex,
    highlightStyle,
    highlightTag,
    sanitize,
    searchWords,
    textToHighlight,
    unhighlightStyle
  }) {
    const node = render(
      <div>
        <Highlighter
          activeIndex={activeIndex}
          activeClassName={activeClassName}
          activeStyle={activeStyle}
          autoEscape={autoEscape}
          highlightClassName={HIGHLIGHT_CLASS}
          highlightStyle={highlightStyle}
          highlightTag={highlightTag}
          sanitize={sanitize}
          searchWords={searchWords}
          textToHighlight={textToHighlight}
          unhighlightClassName={UNHIGHLIGHT_CLASS}
          unhighlightStyle={unhighlightStyle}
        />
      </div>
    )

    return node.children[0]
  }

  it('should properly handle empty searchText', () => {
    const emptyValues = [[], ['']]
    emptyValues.forEach((emptyValue) => {
      const node = getHighlighterChildren({
        searchWords: emptyValue,
        textToHighlight: 'This is text'
      })
      expect(node.children.length).to.equal(1)
      expect(node.querySelectorAll(HIGHLIGHT_QUERY_SELECTOR).length).to.equal(0)
      expect(node.textContent).to.eql('This is text')
    })
  })

  it('should properly handle empty textToHighlight', () => {
    const node = getHighlighterChildren({
      searchWords: ['search'],
      textToHighlight: ''
    })
    expect(node.children.length).to.equal(0)
    expect(node.querySelectorAll(HIGHLIGHT_QUERY_SELECTOR).length).to.equal(0)
    expect(node.textContent).to.eql('')
  })

  it('should highlight searchText words that exactly match words in textToHighlight', () => {
    const node = getHighlighterChildren({
      searchWords: ['text'],
      textToHighlight: 'This is text'
    })
    expect(node.children.length).to.equal(2)
    const matches = node.querySelectorAll(HIGHLIGHT_QUERY_SELECTOR)
    expect(matches.length).to.equal(1)
    expect(matches[0].textContent).to.eql('text')
  })

  it('should handle unclosed parentheses when autoEscape prop is truthy', () => {
    const node = getHighlighterChildren({
      autoEscape: true,
      searchWords: ['('],
      textToHighlight: '(This is text)'
    })
    expect(node.children.length).to.equal(2)
    expect(node.children[0].textContent).to.equal('(')
    expect(node.children[1].textContent).to.equal('This is text)')
    const matches = node.querySelectorAll(HIGHLIGHT_QUERY_SELECTOR)
    expect(matches.length).to.equal(1)
    expect(matches[0].textContent).to.eql('(')
  })

  it('should highlight searchText words that partial-match text in textToHighlight', () => {
    const node = getHighlighterChildren({
      searchWords: ['Th'],
      textToHighlight: 'This is text'
    })
    expect(node.children.length).to.equal(2)
    const matches = node.querySelectorAll(HIGHLIGHT_QUERY_SELECTOR)
    expect(matches.length).to.equal(1)
    expect(matches[0].textContent).to.eql('Th')
    expect(node.children[0].textContent).to.equal('Th')
    expect(node.children[1].textContent).to.equal('is is text')
  })

  it('should highlight multiple occurrences of a searchText word', () => {
    const node = getHighlighterChildren({
      searchWords: ['is'],
      textToHighlight: 'This is text'
    })
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
    const node = getHighlighterChildren({
      searchWords: ['This', 'text'],
      textToHighlight: 'This is text'
    })
    expect(node.children.length).to.equal(3)
    expect(node.querySelectorAll(HIGHLIGHT_QUERY_SELECTOR).length).to.equal(2)
    expect(node.textContent).to.eql('This is text')
    expect(node.children[0].textContent).to.equal('This')
    expect(node.children[1].textContent).to.equal(' is ')
    expect(node.children[2].textContent).to.equal('text')
  })

  it('should match terms in a case insensitive way but show their case-sensitive representation', () => {
    const node = getHighlighterChildren({
      searchWords: ['this'],
      textToHighlight: 'This is text'
    })
    const matches = node.querySelectorAll(HIGHLIGHT_QUERY_SELECTOR)
    expect(matches.length).to.equal(1)
    expect(matches[0].textContent).to.equal('This')
  })

  it('should use the :highlightClassName if specified', () => {
    const node = getHighlighterChildren({
      searchWords: ['text'],
      textToHighlight: 'This is text'
    })
    expect(node.querySelector('mark').className).to.contain(HIGHLIGHT_CLASS)
  })

  it('should use the :highlightStyle if specified', () => {
    const node = getHighlighterChildren({
      highlightStyle: { color: 'red' },
      searchWords: ['text'],
      textToHighlight: 'This is text'
    })
    expect(node.querySelector('mark').style.color).to.contain('red')
  })

  it('should use the :unhighlightStyle if specified', () => {
    const node = getHighlighterChildren({
      unhighlightStyle: { color: 'gray' },
      searchWords: ['text'],
      textToHighlight: 'This is text'
    })
    expect(node.querySelector('span').style.color).to.contain('gray')
  })

  it('should match terms without accents against text with accents', () => {
    const node = getHighlighterChildren({
      sanitize: latinize,
      searchWords: ['example'],
      textToHighlight: 'ỆᶍǍᶆṔƚÉ'
    })
    const matches = node.querySelectorAll(HIGHLIGHT_QUERY_SELECTOR)
    expect(matches.length).to.equal(1)
    expect(matches[0].textContent).to.equal('ỆᶍǍᶆṔƚÉ')
  })

  it('should use the :highlightTag if specified', () => {
    const node = getHighlighterChildren({
      autoEscape: true,
      highlightTag: 'span',
      searchWords: ['text'],
      textToHighlight: 'This is text'
    })
    const matches = node.querySelectorAll(HIGHLIGHT_QUERY_SELECTOR)
    expect(matches[0].tagName).to.equal('SPAN')
  })

  it('should highlight the second match with activeIndex specified', () => {
    const activeClassName = 'active'
    const node = getHighlighterChildren({
      activeIndex: 1,
      activeClassName,
      searchWords: ['text'],
      textToHighlight: 'This is text which should have this text highlighted'
    })
    const matches = node.querySelectorAll('mark')
    expect(matches[1].classList.contains(activeClassName)).to.equal(true)
  })

  it('should be able to apply style to mark', () => {
    const node = getHighlighterChildren({
      unhighlightStyle: {color: 'gray'},
      searchWords: [{
        word: 'text',
        style: {backgroundColor: 'red'}
      }],
      textToHighlight: 'This is text'
    })
    expect(node.querySelector('mark').style.backgroundColor).to.contain('red')
  })

  it('should be able to apply activeStyle style to mark if active', () => {
    const node = getHighlighterChildren({
      unhighlightStyle: {color: 'gray'},
      searchWords: [{
        word: 'text',
        style: {backgroundColor: 'red'}
      }],
      activeIndex: 0,
      activeStyle: {backgroundColor: 'green'},
      textToHighlight: 'This is text'
    })
    expect(node.querySelector('mark').style.backgroundColor).to.contain('green')
  })
})
