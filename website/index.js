/**
 * This is the entry point to the documentation/demo/test harness site for react-highlight-words.
 * This target is published to the root of the `gh-pages` branch.
 * @flow
 */
import Application from './Application'
import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

const root = createRoot(document.getElementById('root'))
root.render(<Application/>)
