
describe("Login", function() {
  it("Front page has login button", function() {
    cy.visit("http://localhost:3000");
    
    cy.get("#submit").click(); // placeholder
    cy.contains("Kirjaudu");
  });
});

describe("Title is shown on frontpage", function() { 
  it("Front page has text Lintuasemasovellus", function() {
    cy.visit("http://localhost:3000");
    
    cy.get("#submit").click(); // placeholder
    cy.contains("Lintuasemasovellus");
  });
});


describe("Navigation bar", function() { 
  it("Front page has navigation bar", function() {
    cy.visit("http://localhost:3000");
    
    cy.get("#submit").click(); // placeholder
    cy.get("#navigationbar"); //risuaita, koska on nappula. Jos olisi ilman niin etsisi navigationbar-tyyppistä elementtiä.
  });                              //nimi navigationbar on annettu elementille, jotta se löytyisi. Laitettu NavBar.js tiedostoon (kts. kommentti siellä)
});
