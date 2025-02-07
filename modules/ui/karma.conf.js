module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-jasmine-html-reporter'),
      require('karma-chrome-launcher'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      captureConsole: false,
      clearContext: false
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/ui'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' },
        { type: 'lcov' }
      ],
      check: {
        global: {
          statements: 80,
          branches: 80,
          functions: 80,
          lines: 80
        }
      }
    },
    autoWatch: true,
    singleRun: false,
    restartOnFileChange: true,
    captureTimeout: 210000,
    browserDisconnectTolerance: 3,
    browserDisconnectTimeout : 210000,
    browserNoActivityTimeout : 210000,
    colors: true,
  })
}
