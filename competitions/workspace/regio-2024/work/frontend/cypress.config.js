const { defineConfig } = require("cypress");
const plugins = require('@skills17/cypress-helpers/plugins').default;

module.exports = defineConfig({
    e2e: {
        watchForFileChanges: true,
        screenshotOnRunFailure: false,
        video: false,
        defaultCommandTimeout: 1500,
        setupNodeEvents(on, config) {
            plugins(on, config);
        },
    },
});
