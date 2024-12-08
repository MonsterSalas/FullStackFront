module.exports = function (config) {
    config.set({
      basePath: '',
      frameworks: ['jasmine', '@angular-devkit/build-angular'],
      plugins: [
        require('karma-jasmine'),
        require('karma-chrome-launcher'),
        require('karma-jasmine-html-reporter'),
        require('karma-coverage'),
        require('@angular-devkit/build-angular/plugins/karma')
      ],
      client: {
        jasmine: {
          // Configuration options for Jasmine
        },
        clearContext: false // Leave Jasmine Spec Runner output visible in browser
      },
      jasmineHtmlReporter: {
        suppressAll: true // Removes duplicated traces
      },
      coverageReporter: {
        dir: require('path').join(__dirname, './coverage/paradise-essence'),
        subdir: '.',
        reporters: [
          { type: 'html' },         // Generates an HTML report
          { type: 'text-summary' }, // Prints a summary in the console
          { type: 'lcov' }          // Generates LCOV format for SonarCloud
        ]
      },
      reporters: ['progress', 'kjhtml'],
      browsers: ['ChromeHeadless'], // Use Headless mode for CI/CD
      singleRun: true, // Ensures tests run once and exit (useful for CI/CD pipelines)
      restartOnFileChange: true
    });
  };