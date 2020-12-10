

export function myBeforeEach() {
    cy.wait(1000);
    cy.visit("http://localhost:3000");

    // Github actionsissa täytyy olla localhost:3000 (eli kun pushaat, valitse 3000)

    cy.visit("http://localhost:3000/testlogin?token=MzJkNTVkMjAtZTFjZS00NzEzLTlkM2MtMmRjZGI1ODYyNGUw");
    //cy.request("http://localhost:5000/testlogin?token=MzJkNTVkMjAtZTFjZS00NzEzLTlkM2MtMmRjZGI1ODYyNGUw");
    cy.visit("http://localhost:3000");



    const user = {
      id: "asdfsommol",
      fullName: "Asdf Sommol",
      emailAddress: "asdf@sommol.net"
    };

    cy.window()
      .its("store")
      .invoke("dispatch", {
        type: "SET_USER",
        data: {
          user
        },
      });


    cy.get("#select-observatory").click();
    cy.contains("Hangon Lintuasema").click();
    cy.get("#submit").contains("Tallenna").click();
    cy.contains("Hangon Lintuasema");
};