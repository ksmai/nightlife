'use strict';

module.exports = function(config) {
  config.set({
    files: [
      './bin/vendors.min.js',
      './bower_components/angular-mocks/angular-mocks.js',
      './bin/app.min.js',
      './src/client/**/*.spec.js'
    ],
    browsers: ['Chrome', 'Firefox'],
    frameworks: ['jasmine']
  });
}
