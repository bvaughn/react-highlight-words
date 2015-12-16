/**
 * This is the entray point to the documentation/demo/test harness site for react-text-highlighter.
 * This target is published to the root of the `gh-pages` branch.
 * @flow
 */
import Application from './Application'
import React from 'react'
import { render } from 'react-dom'

render(
  <Application/>,
  document.getElementById('root')
)
