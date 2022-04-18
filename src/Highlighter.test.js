import PropTypes from 'prop-types'
import React from 'react'
import Highlighter from './Highlighter'
import { render } from './test-utils'
import expect from 'expect.js'
import latinize from 'latinize'

describe('Highlighter', () => {
  const HIGHLIGHT_CLASS = 'customHighlightClass'
  const HIGHLIGHT_QUERY_SELECTOR = `.${HIGHLIGHT_CLASS}`
  const UNHIGHLIGHT_CLASS = 'customUnhighlightClass'
  const UNHIGHLIGHT_QUERY_SELECTOR = `.${UNHIGHLIGHT_CLASS}`

  function getHighlighterChildren ({
    autoEscape,
    activeClassName,
    activeStyle,
    activeIndex,
    caseSensitive,
    findChunks,
    highlightStyle,
    highlightTag,
    sanitize,
    searchWords,
    textToHighlight,
    unhighlightTag,
    unhighlightStyle,
    highlightClassName,
    ...rest
  }) {
    const node = render(
      <div>
        <Highlighter
          activeClassName={activeClassName}
          activeIndex={activeIndex}
          activeStyle={activeStyle}
          autoEscape={autoEscape}
          caseSensitive={caseSensitive}
          findChunks={findChunks}
          highlightClassName={highlightClassName || HIGHLIGHT_CLASS}
          highlightStyle={highlightStyle}
          highlightTag={highlightTag}
          sanitize={sanitize}
          searchWords={searchWords}
          textToHighlight={textToHighlight}
          unhighlightTag={unhighlightTag}
          unhighlightClassName={UNHIGHLIGHT_CLASS}
          unhighlightStyle={unhighlightStyle}
          {...rest}
        />
      </div>
    )

    return node.children[0]
  }

  let consoleError

  beforeEach(() => {
    consoleError = console.error

    // React DEV warnings should fail tests
    console.error = function (message) {
      consoleError.apply(console, arguments)
      throw new Error(message)
    }
  })

  afterEach(() => {
    console.error = consoleError
  })

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

  it('should handle Regex searchText', () => {
    const node = getHighlighterChildren({
      searchWords: [/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/, 'This'],
      textToHighlight: 'This is my phone (123) 456 7899'
    })
    expect(node.querySelectorAll(HIGHLIGHT_QUERY_SELECTOR).length).to.equal(2)
    expect(node.textContent).to.eql('This is my phone (123) 456 7899')
    expect(node.children[0].textContent).to.equal('This')
    expect(node.children[1].textContent).to.equal(' is my phone ')
    expect(node.children[2].textContent).to.equal('(123) 456 7899')
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

  it('should support class components via :highlightTag', () => {
    class HighlightTag extends React.Component {
      static propTypes = {
        children: PropTypes.any,
        highlightIndex: PropTypes.number
      }

      render () {
        const { highlightIndex, ...rest } = this.props

        return (
          <span {...rest} />
        )
      }
    }

    const node = getHighlighterChildren({
      autoEscape: true,
      highlightTag: HighlightTag,
      searchWords: ['text'],
      textToHighlight: 'This is text'
    })
    const matches = node.querySelectorAll(HIGHLIGHT_QUERY_SELECTOR)
    expect(matches[0].tagName).to.equal('SPAN')
  })

  it('should support stateless functional components via :highlightTag', () => {
    const HighlightTag = ({ highlightIndex, ...rest }) => (
      <span {...rest} />
    )

    const node = getHighlighterChildren({
      autoEscape: true,
      highlightTag: HighlightTag,
      searchWords: ['text'],
      textToHighlight: 'This is text'
    })
    const matches = node.querySelectorAll(HIGHLIGHT_QUERY_SELECTOR)
    expect(matches[0].tagName).to.equal('SPAN')
  })

  it('should apply activeClassName to the match specified by activeIndex', () => {
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

  it('should apply activeStyle to the match specified by activeIndex', () => {
    const activeStyle = { color: 'red' }
    const node = getHighlighterChildren({
      activeIndex: 1,
      activeStyle,
      searchWords: ['text'],
      textToHighlight: 'This is text which should have this text highlighted'
    })
    const matches = node.querySelectorAll('mark')
    expect(matches[1].style.color).to.equal('red')
  })

  it('should support caseSensitive search', () => {
    const node = getHighlighterChildren({
      caseSensitive: true,
      searchWords: ['th'],
      textToHighlight: 'This the three time'
    })
    const matches = node.querySelectorAll(HIGHLIGHT_QUERY_SELECTOR)
    expect(matches).to.have.length(2)
    expect(matches[0].textContent).to.equal('th')
    expect(matches[1].textContent).to.equal('th')
  })

  it('should support custom findChunks prop function', () => {
    const node = getHighlighterChildren({
      findChunks: () => (
        [
          { start: 0, end: 1 },
          { start: 5, end: 7 }
        ]
      ),
      searchWords: ['xxx'],
      textToHighlight: 'This is text'
    })
    const matches = node.querySelectorAll(HIGHLIGHT_QUERY_SELECTOR)
    expect(matches).to.have.length(2)
    expect(matches[0].textContent).to.equal('T')
    expect(matches[1].textContent).to.equal('is')

    const node2 = getHighlighterChildren({
      findChunks: () => (
        []
      ),
      searchWords: ['This'],
      textToHighlight: 'This is text'
    })
    const matches2 = node2.querySelectorAll(HIGHLIGHT_QUERY_SELECTOR)
    expect(matches2).to.have.length(0)
  })

  it('should render chucks with the appropriate classes when case-insensitive', () => {
    const node = getHighlighterChildren({
      searchWords: ['This', 'is', 'text'],
      textToHighlight: 'This is text',
      highlightClassName: { This: 'this', is: 'is', text: 'text' }
    })
    const allMatches = node.querySelectorAll('mark')
    expect(allMatches).to.have.length(3)
    expect(allMatches[0].classList).to.contain('this')
    expect(allMatches[1].classList).to.contain('is')
    expect(allMatches[2].classList).to.contain('text')
  })

  it('should render chucks with the appropriate classes when case-sensitive', () => {
    const node = getHighlighterChildren({
      caseSensitive: true,
      searchWords: ['This', 'is', 'TEXT'],
      textToHighlight: 'This is TEXT',
      highlightClassName: { this: 'this', is: 'is', text: 'text' }
    })
    const allMatches = node.querySelectorAll('mark')
    expect(allMatches).to.have.length(3)
    expect(allMatches[0].classList).not.to.contain('this')
    expect(allMatches[1].classList).to.contain('is')
    expect(allMatches[2].classList).not.to.contain('text')
  })

  it('should spread additional custom props onto the wrapper span', () => {
    const node = getHighlighterChildren({
      searchWords: ['This', 'is', 'TEXT'],
      textToHighlight: 'This is TEXT',
      'data-test-attribute': 'data attribute content',
      title: 'span title',
      className: 'test-class'
    })

    const matches = node.querySelectorAll('.test-class')
    expect(matches).to.have.length(0)
    expect(node.title).to.equal('span title')
    expect(node.classList.contains('test-class')).to.equal(true)
    expect(node.dataset.testAttribute).to.equal('data attribute content')
  })

  it('should use :unhighlightTag if provided', () => {
    const node = getHighlighterChildren({
      searchWords: ['This', 'is', 'TEXT'],
      textToHighlight: 'Hello World',
      unhighlightTag: 'div',
      unhighlightClassName: UNHIGHLIGHT_CLASS
    })

    const matches = node.querySelectorAll(`.${UNHIGHLIGHT_CLASS}`)
    expect(matches).to.have.length(1)
    expect(matches[0].nodeName).to.equal('DIV')
  })

  it('should support class components via :unhighlightTag', () => {
    class UnHighlightTag extends React.Component {
      static propTypes = {
        children: PropTypes.any,
        highlightIndex: PropTypes.number
      }

      render () {
        const { highlightIndex, ...rest } = this.props

        return (
          <a {...rest} />
        )
      }
    }

    const node = getHighlighterChildren({
      autoEscape: true,
      unhighlightTag: UnHighlightTag,
      searchWords: ['text'],
      textToHighlight: 'This is text'
    })
    const matches = node.querySelectorAll(UNHIGHLIGHT_QUERY_SELECTOR)
    expect(matches[0].tagName).to.equal('A')
  })

  it('should support stateless functional components via :highlightTag', () => {
    const UnHighlightTag = ({ highlightIndex, ...rest }) => (
      <a {...rest} />
    )

    const node = getHighlighterChildren({
      autoEscape: true,
      unhighlightTag: UnHighlightTag,
      searchWords: ['text'],
      textToHighlight: 'This is text'
    })
    const matches = node.querySelectorAll(UNHIGHLIGHT_QUERY_SELECTOR)
    expect(matches[0].tagName).to.equal('A')
  })
})
