const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
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
