import { myBeforeEach } from "../methods.js";

describe("FirstpageFieldsAndModification", function () {
  beforeEach(function () {
    myBeforeEach();
  });

  it("There are fields for adding observation station name, date, observers, comment, daily actions and a button Save for the observation and day", function () {

    cy.contains("Lisää havaintoja");
    cy.contains("Päivämäärä");
    cy.contains("Havainnoija(t)");
    cy.get("#catches-header").contains("Ei pyydyksiä");
    cy.get("#comment-header").contains("Ei kommentteja");
    cy.get("#activity-header").contains("Ei havainnointiaktiivisuusmerkintöjä");

    cy.get("#comment-header").click();
    cy.contains("Havainnointi- ja pyydyskommentit");
    cy.get("#activity-header").click();
    cy.contains("Vakiohavainnointi");
    cy.contains("Gåulla käynti");
    cy.contains("Rengastusvakio");
    cy.contains("Pöllövakio");
    cy.contains("Nisäkkäät yms. laskettu");
    cy.contains("Liitteitä");
    cy.get("#catches-header").click();
    cy.contains("+");

    cy.contains("Tyyppi");
    cy.contains("Sijainti");
    cy.contains("Rengastusvakio");
    cy.contains("Liitteitä");
    cy.contains("Siirry koontinäkymään");
    cy.contains("Tallenna muuttohavainnot");
  });

  it("Observatory can be modified", function () {
    cy.get("#observatorySelector").click();
    cy.get("#select-observatory").click();
    cy.contains("Jurmon Lintuasema").click();
    cy.get("#submit").contains("Tallenna").click();
    cy.contains("Jurmo");
  });

  it("Navigationbar works", function () {
    cy.get("#navigationbar").click();
    cy.get("#showdays").click({ force: true });
    cy.contains("Havainnointiasema");
    cy.get("#navigationbar").click();
    cy.get("#manual").click({ force: true });
    cy.contains("Päivän ja havaintojen lisääminen");
    cy.get("#navigationbar").click();
    cy.get("#frontpage").click({ force: true });
    cy.contains("Lisää havaintoja");
  });

  it("Catch rows can be added and removed", function () {
    cy.get("#catches-header").click();
    cy.get("#plus-catch-row-button").click();
    cy.get("#0").contains("Pyydys")
    cy.get("#0").contains("Pyyntialue")
    cy.get("#plus-catch-row-button").click();
    cy.get("#0 #removeButton").click();
    cy.get("#1").should("not.exist");
  });

  it("Observation header contains 'Muuttohavainnot'", function () {
    cy.get("#observation-header");
    cy.contains("Muuttohavainnot");
  });

  it("Type dropdown menu contains types 'Vakio', 'Muu muutto', 'Yömuutto' and 'Hajahavainto'", function () {
    cy.get("#selectType").click();
    cy.get('ul').children()
      .should('contain','Vakio')
      .and('contain','Muu muutto')
      .and('contain','Yömuutto');
  });

  it("Type dropdown menu does not contain type 'Paikallinen'", function () {
    cy.get("#selectType").click();
    cy.get('ul').children()
      .should('not.contain','Paikallinen')
      .and("not.contain", "Hajahavainto");
  });

});