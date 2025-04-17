module.exports = function (config) {
  config.set({
    // Base path used to resolve all patterns (e.g., files, exclude)
    basePath: '',

    // Frameworks to use – Angular CLI handles TypeScript via @angular-devkit/build-angular
    frameworks: ['jasmine', '@angular-devkit/build-angular'],

    // Plugins required by Karma
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-coverage'),
      require('karma-jasmine-html-reporter'),
      require('karma-sonarqube-reporter'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],

    // Client configuration
    client: {
      // Keeps the Jasmine Spec Runner output visible in the browser
      clearContext: false
    },

    // Coverage reporter configuration
    coverageReporter: {
      type : 'lcov',
      dir : require('path').join(__dirname, 'coverage'),
      subdir: '.'
    },

    sonarqubeReporter: {
      basePath: "src", // test files folder
      filePattern: "**/*spec.ts", // test files glob pattern
      encoding: "utf-8", // test files encoding
      outputFolder: "coverage", // report destination
      legacyMode: false, // report for Sonarqube < 6.2 (disabled)
      reportName: () => {
        // report name callback
        return "TEST-indie-desk-ui-spec.sonarqube.xml";
      }
    },

    // Test result reporters to use
    reporters: ["coverage", "kjhtml", "sonarqube"],

    // Web server port
    port: 9876,

    // Enable colored output in the logs and reports
    colors: true,

    // Level of logging
    logLevel: config.LOG_INFO,

    // Enable watching files and executing tests whenever any file changes
    autoWatch: true,

    // Start these browsers (Chrome in this case)
    browsers: ['Chrome'],

    // If true, Karma captures browsers, runs the tests, and exits
    singleRun: false,

    // Restart browser on file changes
    restartOnFileChange: true
  });
};
