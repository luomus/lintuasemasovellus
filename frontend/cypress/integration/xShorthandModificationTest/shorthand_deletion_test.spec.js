import { myBeforeEach } from "../methods.js";


const date = "04.03.2021";
const observer = "Aarni Apulaishavainnoitsija";
const comment = "Olipa sateinen sää.";
const shorthand = "10:00\nsommol 1/2 W\n12:00\n12:30\ngrugru 1 E\n13:00\n13:30\nanacre 3 N\n14:00";


describe("ShorthandDeletion", function () {

  beforeEach(function () {
    myBeforeEach();
  });


  it("An observation and observation day can be saved on firstpage for Vakio", function () {

    cy.get("#date-picker-inline").clear();
    cy.get("#date-picker-inline").type(date);
    cy.get("#observers").clear();
    cy.get("#comment-header").click();
    cy.get("#comment").clear();
    cy.wait(1000);
    cy.get("#observers").type(observer);
    cy.get("#comment").type(comment);
    cy.get("#activity-header").click();
    cy.get("#selectType").click().get("#Vakio").click();
    cy.get("#selectLocation").click().get("#Bunkkeri").click();
    cy.get(".CodeMirror textarea").type(shorthand, { force: true });
    cy.wait(1000);
    cy.contains("Tallenna muuttohavainnot").click({ force: true });
    cy.wait(1000);
    cy.contains(date);
  });

  it("Individual observation period can be deleted", function () {
    cy.contains(date).click();
    cy.contains('Jaksot').click();
    cy.get("#editObsPeriod").click();
    cy.wait(1000);
    cy.contains("Poista").click({ force: true });
    cy.wait(1000);
    cy.get("#confirmButton").click({ force: true });
    cy.wait(5000);
    cy.contains('Lajit').click();
    cy.get("#speciesTable").should("not.contain", "SOMMOL");
    cy.contains("GRUGRU");
    cy.contains("ANACRE");
  });

  it("All observations for type and location can be deleted", function () {
    cy.contains(date).click();
    cy.contains('Muokkaa').click();
    cy.wait(2000);
    cy.get("#selectTypeInModification").click().get("#Vakio").click();
    cy.get("#selectLocationInModification").click().get("#Bunkkeri").click();
    cy.wait(1000);
    cy.contains("Poista").click({ force: true });
    cy.wait(1000);
    cy.get("#confirmButton").click({ force: true });
    cy.wait(5000);
    cy.get("#speciesTable").should("not.contain", "GRUGRU");
    cy.get("#speciesTable").should("not.contain", "ANACRE");
  });
});