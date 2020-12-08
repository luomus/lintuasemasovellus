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

});