 /*describe("ObservatoryChosen", function() {
 beforeEach(function() {
    cy.visit("http://localhost:3000");
    cy.get("#login-link");
    cy.contains("Kirjaudu");
    //cy.visit("http://localhost:3000/testlogin?token=MzJkNTVkMjAtZTFjZS00NzEzLTlkM2MtMmRjZGI1ODYyNGUw");

    const user = {
      id: 'asdfsommol',
      fullName: 'Asdf Sommol',
      emailAddress: 'asdf@sommol.net'
    }

    cy.window()
      .its('store')
      .invoke('dispatch', {
        type: 'SET_USER',
        data: {
          user
        },
      })

    cy.get("#select-observatory").click().get("ul > li").eq(0).click(); 
    cy.get("#submit").contains("Tallenna").click();
    cy.get("#logout-link").click(); 
    cy.contains("Kirjaudu sisään")

 });


describe("Title is shown on frontpage", function() {
      cy.contains("Lintuasemasovellus");
    });
  
  
describe("Navigation bar", function() {
      cy.get("#navigationbar").click();; 
    });                              
  }); 
  */