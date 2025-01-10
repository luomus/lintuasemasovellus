// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add("inputDate", (date) => {
  cy.get("#date-picker-inline").should("be.enabled");
  cy.get("#date-picker-inline").clear();
  cy.get("#date-picker-inline").type(date).blur();
  cy.wait(0);
  cy.get("#date-picker-inline").should("be.enabled");
});

Cypress.Commands.add("waitUntilHomePageReady", () => {
  cy.get("#date-picker-inline").should("be.enabled");
});
