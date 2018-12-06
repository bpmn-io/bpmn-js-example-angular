const config = require('./protractor.conf').config;

config.capabilities = {
  browserName: 'chrome',
  chromeOptions: {
    binary: require('puppeteer').executablePath(),
    args: [
      '--headless',
      '--no-sandbox',
      '--disable-gpu'
    ]
  }
};

exports.config = config;