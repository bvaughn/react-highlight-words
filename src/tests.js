// Reference: https://babeljs.io/docs/usage/polyfill/
// Reference: https://github.com/zloirock/core-js
// Polyfill a full ES6 environment
import 'babel/polyfill'

// Reference: https://github.com/webpack/karma-webpack#alternative-usage
const tests = require.context('.', true, /\.test\.js$/)
tests.keys().forEach(tests)
