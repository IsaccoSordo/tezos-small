// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

function getDefaultBrowser() {
    const { execSync } = require('child_process');
    const fs = require('fs');
    const os = require('os');
    const platform = os.platform();

    // Browser detection with cross-platform paths
    const browserConfigs = [
        // Firefox
        {
            name: 'Firefox',
            executable: platform === 'win32' ? 'firefox.exe' : 'firefox',
            paths: platform === 'darwin'
                ? ['/Applications/Firefox.app/Contents/MacOS/firefox']
                : platform === 'win32'
                    ? ['C:\\Program Files\\Mozilla Firefox\\firefox.exe', 'C:\\Program Files (x86)\\Mozilla Firefox\\firefox.exe']
                    : ['/usr/bin/firefox', '/snap/bin/firefox']
        },
        // Chrome
        {
            name: 'Chrome',
            executable: platform === 'win32' ? 'chrome.exe' : 'google-chrome',
            paths: platform === 'darwin'
                ? ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome']
                : platform === 'win32'
                    ? ['C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe']
                    : ['/usr/bin/google-chrome', '/snap/bin/chromium', '/usr/bin/chromium-browser']
        },
        // Chromium
        {
            name: 'Chromium',
            executable: platform === 'win32' ? 'chromium.exe' : 'chromium',
            paths: platform === 'darwin'
                ? ['/Applications/Chromium.app/Contents/MacOS/Chromium']
                : platform === 'win32'
                    ? ['C:\\Program Files\\Chromium\\Application\\chromium.exe']
                    : ['/usr/bin/chromium', '/usr/bin/chromium-browser']
        },
        // Safari (macOS only)
        {
            name: 'Safari',
            executable: 'safari',
            paths: ['/Applications/Safari.app/Contents/MacOS/Safari']
        }
    ];

    // Try each browser
    for (const browser of browserConfigs) {
        // First, try common paths for this platform
        for (const path of browser.paths) {
            if (fs.existsSync(path)) {
                console.log(`✅ Detected browser: ${browser.name}`);
                return browser.name;
            }
        }

        // Then, try to find executable in PATH
        try {
            execSync(`which ${browser.executable}`, { stdio: 'ignore' });
            console.log(`✅ Detected browser: ${browser.name}`);
            return browser.name;
        } catch (e) {
            // Browser not found, continue to next
        }
    }

    // Fallback: use ChromeHeadless as last resort
    console.warn('⚠️  No browsers detected. Falling back to ChromeHeadless.');
    return 'ChromeHeadless';
}


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