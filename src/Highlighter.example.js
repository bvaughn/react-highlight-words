import React, { Component } from 'react'
import Highlighter from './Highlighter'
import styles from './Highlighter.example.css'

export default class HighlighterExample extends Component {
  constructor (props) {
    super(props)

    this.state = {
      searchText: 'and or the',
      textToHighlight: `When in the Course of human events it becomes necessary for one people to dissolve the political bands which have connected them with another and to assume among the powers of the earth, the separate and equal station to which the Laws of Nature and of Nature's God entitle them, a decent respect to the opinions of mankind requires that they should declare the causes which impel them to the separation.`
    }
  }
  render () {
    const { ...props } = this.props
    const { searchText, textToHighlight } = this.state
    const searchWords = searchText.split(/\s/).filter(word => word)

    return (
      <div {...props}>
        <h4 className={styles.Header}>
          Search terms
        </h4>
        <input
          className={styles.Input}
          name='searchTerms'
          value={searchText}
          onChange={event => this.setState({ searchText: event.target.value })}/>

        <h4 className={styles.Header}>
          Body of Text
        </h4>
        <textarea
          className={styles.Input}
          name='textToHighlight'
          value={textToHighlight}
          onChange={event => this.setState({ textToHighlight: event.target.value })}/>

        <h4 className={styles.Header}>
          Output
        </h4>

        <Highlighter
          highlightClassName={styles.Highlight}
          highlightStyle={{ fontWeight: 'normal' }}
          searchWords={searchWords}
          textToHighlight={textToHighlight}
        />

        <p className={styles.Footer}>
          <a href='https://github.com/bvaughn/react-highlight-words/blob/master/src/Highlighter.example.js'>
            View the source
          </a>
        </p>
      </div>
    )
  }
}
