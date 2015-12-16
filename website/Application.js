import React from 'react'
import HighlighterExample from '../src/Highlighter.example'
import styles from './Application.css'

export default function Application () {
  return (
    <div className={styles.demo}>
      <HighlighterExample/>
    </div>
  )
}
