

export function myBeforeEach() {
  cy.wait(1000);
  cy.visit("http://localhost:3000");

  const personToken = Cypress.env("person_token");
  const loginUrl = `http://localhost:3000/api/login?token=${personToken}`;

  if (loginPort === 3000) {
    cy.visit(loginUrl);
  } else {
    cy.request(loginUrl);
  }

  cy.visit("http://localhost:3000");




  const user = {
    id: "asdf",
    fullName: "Lintu Asema",
    emailAddress: "lintuasema@lintuasema.com"
  };


  cy.window()
    .its("store")
    .invoke("dispatch", {
      type: "SET_USER",
      data: {
        user
      },
    });

  cy.get("body").wait(1000)
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
