module.exports = function (config) {
  config.set({
    browsers: ['PhantomJS2'],
    frameworks: ['mocha'],
    files: ['src/tests.js'],
    preprocessors: {
      'src/tests.js': ['webpack', 'sourcemap']
    },
    junitReporter: {
      outputDir: (process.env.CIRCLE_TEST_REPORTS || 'public') + '/karma',
      suite: 'karma'
    },
    singleRun: true,
    plugins: [
      require('karma-mocha'),
      require('karma-webpack'),
      require('karma-spec-reporter'),
      require('karma-junit-reporter'),
      require('karma-sourcemap-loader'),
      require('karma-phantomjs2-launcher')
    ],
    webpack: require('./webpack.config.dev')
  })
}
