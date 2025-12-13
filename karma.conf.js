// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine', '@angular-devkit/build-angular'],
        plugins: [
            require('karma-jasmine'),
            require('karma-chrome-launcher'),
            require('karma-firefox-launcher'),
            require('karma-safari-launcher'),
            require('karma-jasmine-html-reporter'),
            require('karma-coverage'),
            require('@angular-devkit/build-angular/plugins/karma')
        ],
        client: {
            jasmine: {
                // you can add configuration options for Jasmine here
                // the possible options are listed at https://jasmine.github.io/api/edge/Configuration.html
                // for example, you can disable the random execution with `random: false`
                // or set a specific seed with `seed: 4321`
            },
            clearContext: false // leave Jasmine Spec Runner output visible in browser
        },
        jasmineHtmlReporter: {
            suppressAll: true // removes the duplicated traces
        },
        coverageReporter: {
            dir: require('path').join(__dirname, './coverage/tezos-small'),
            subdir: '.',
            reporters: [
                { type: 'html' },
                { type: 'text-summary' }
            ]
        },
        reporters: ['progress', 'kjhtml'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: [getDefaultBrowser()],
        singleRun: false,
        restartOnFileChange: true,
        customLaunchers: {
            ChromeHeadlessCI: {
                base: 'ChromeHeadless',
                flags: ['--no-sandbox']
            }
        }
    });
};

function getDefaultBrowser() {
    const os = require('os');
    const fs = require('fs');
    const path = require('path');
    const platform = os.platform();

    const browserPaths = {
        'Firefox': '/Applications/Firefox.app',
        'Google Chrome': '/Applications/Google Chrome.app',
        'Chromium': '/Applications/Chromium.app',
        'Safari': '/Applications/Safari.app'
    };

    for (const [browserName, browserPath] of Object.entries(browserPaths)) {
        if (fs.existsSync(browserPath)) {
            console.log(`🌐 Detected browser: ${browserName}`);
            return browserName;
        }
    }

    throw new Error('No supported browsers found on the system.');
}
