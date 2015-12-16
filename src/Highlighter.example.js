import React, { Component } from 'react'
import Highlighter from './Highlighter'
import styles from './Highlighter.example.css'

export default class HighlighterExample extends Component {
  constructor (props) {
    super(props)

    this.state = {
      searchText: 'is',
      textToHighlight: 'This is some text.'
    }
  }
  render () {
    const { ...props } = this.props
    const { searchText, textToHighlight } = this.state
    const searchWords = searchText.split(/\s/).filter(word => word)

    return (
      <div {...props}>
        <div className={styles.LabelAndInputRow}>
          <label className={styles.Label}>Search terms</label>
          <input
            name='searchTerms'
            value={searchText}
            onChange={event => this.setState({ searchText: event.target.value })}/>
          <label className={styles.Label}>Text to highlight</label>
          <input
            name='textToHighlight'
            value={textToHighlight}
            onChange={event => this.setState({ textToHighlight: event.target.value })}/>
        </div>

        <Highlighter
          searchWords={searchWords}
          textToHighlight={textToHighlight}/>
      </div>
    )
  }
}
