const { defineConfig } = require('cypress')
const fs = require('fs')

module.exports = defineConfig({
  video: true,
  e2e: {
    setupNodeEvents(on, config) {
      on('after:spec', (spec, results) => {
        if (results && results.video) {
          // Do we have failures for any retry attempts?
          const failures = results.tests.some((test) =>
            test.attempts.some((attempt) => attempt.state === 'failed')
          )
          if (!failures) {
            // delete the video if the spec passed and no tests retried
            fs.unlinkSync(results.video)
          }
        }
      })

      const legacyConfig = require('./cypress/plugins/index.js')(on, config);

      if (config.isTextTerminal) {
        // skip the all.cy.js spec in "cypress run" mode
        return {
          ...legacyConfig,
          excludeSpecPattern: ['cypress/e2e/all.cy.js'],
        }
      }

      return legacyConfig;
    }
  },
})
