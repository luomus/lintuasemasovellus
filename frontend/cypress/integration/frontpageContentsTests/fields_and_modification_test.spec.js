import { myBeforeEach } from "../methods.js";

describe("FirstpageFieldsAndModification", function() {
  beforeEach(function() {
    myBeforeEach();
  });

it("There are fields for adding observation station name, date, observers, comment and a button Save for the observation and day", function() {

  cy.contains("Lisää havaintoja");
  cy.contains("Päivämäärä");
  cy.contains("Havainnoija(t)");
  cy.contains("Kommentti");
  cy.contains("Tyyppi");
  cy.contains("Sijainti");
  cy.contains("Tallenna");
});

it("Observatory can be modified" , function() {
  cy.get("#observatorySelector").click();
  cy.get("#select-observatory").click();
  cy.contains("Jurmon Lintuasema").click();
  cy.get("#submit").contains("Tallenna").click();
  cy.contains("Jurmo");

});

it("Navigationbar works", function(){
  cy.get("#navigationbar").click();
  cy.get("#showdays").click({force:true});
  cy.contains("Havainnointiasema");
  cy.get("#navigationbar").click();
  cy.get("#manual").click({force:true});
  cy.contains("Lintuaseman valinta");
  cy.get("#navigationbar").click();
  cy.get("#frontpage").click({force:true});
  cy.contains("Lisää havaintoja");



  
});

});