describe("Login", function() {

  it("Front page redirects to login page if user is not logged in", function() {
    cy.visit("http://localhost:3000");
    cy.contains("Tähän banneri");
    cy.contains("Lisää havaintoja").should("not.exist");
  });
  
  it("User can login and logout", function () {
    cy.contains("Tähän banneri");


    //cy.visit("http://localhost:3000/testlogin?token=MzJkNTVkMjAtZTFjZS00NzEzLTlkM2MtMmRjZGI1ODYyNGUw");
    cy.request("http://localhost:5000/testlogin?token=MzJkNTVkMjAtZTFjZS00NzEzLTlkM2MtMmRjZGI1ODYyNGUw");
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

    //cy.get("#select-observatory").click().get("ul > li").eq(0).click();
    cy.get("#select-observatory").click();
    cy.contains("Hangon Lintuasema").click();
    cy.get("#submit").contains("Tallenna").click();
    cy.contains("Lisää havaintoja")
    cy.get("#logout-link").click();
    //cy.visit("http://localhost:3000");
    //cy.contains("Tähän banneri");

  });
  
});

