describe("Login", function() {

  it("Front page redirects to login page if user is not logged in", function() {
    cy.visit("http://localhost:3000");
    cy.contains("Tähän banneri");
    cy.contains("Lisää havaintoja").should("not.exist");
  });
  
});

