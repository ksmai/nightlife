'use strict';

exports.config = {
  allScriptsTimeout: 11000,
  specs: [
    '*.js'
  ],
  capabilities: {
    browserName: 'chrome',
    chromeOptions: {
      prefs: {'profile.managed_default_content_settings.geolocation': 3}
    }
  },
  baseUrl: 'http://localhost:3000/',
  framework: 'jasmine',
  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000
  }
};
