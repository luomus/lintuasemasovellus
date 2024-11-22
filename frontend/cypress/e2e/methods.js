
export function myBeforeEach() {
  const personToken = Cypress.env("person_token");
  const loginUrl = `http://localhost:3000/api/login?token=${personToken}`;

  cy.visit(loginUrl);

  cy.get("#select-observatory,#observatorySelector",{ timeout: 5000 }).should("exist");
  cy.get("body")
    .then(($body) => {
      if ($body.text().includes("Valitse")) {
        cy.get("#select-observatory").click();
        cy.contains("Hangon Lintuasema").click();
        cy.get("#submit").contains("Tallenna").click();
      } else if ($body.text().includes("Jurmon Lintuasema")) {
        cy.get("#observatorySelector").click();
        cy.get("#select-observatory").click();
        cy.contains("Hangon Lintuasema").click();
        cy.get("#submit").contains("Tallenna").click();
      }
    });

  cy.contains("Hangon Lintuasema");
}
