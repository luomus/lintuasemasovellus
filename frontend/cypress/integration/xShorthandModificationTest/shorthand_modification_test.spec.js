import { myBeforeEach } from "../methods.js";


const date = "02.01.2020";
const observer = "Aarni Apulaishavainnoitsija";
const comment = "Olipa sateinen sää.";
const shorthand = "10:00\nsommol 1/2 W\n12:00";
const shorthandModified = "10:00\ngrugru 1/2 W\n12:00";


describe("ShorthandModification", function () {

  beforeEach(function () {
    myBeforeEach();
  });


  it("An observation and observation day can be saved on firstpage for Vakio", function () {

    cy.get("#date-picker-inline").clear();
    cy.get("#date-picker-inline").type(date);
    cy.get("#observers").clear();
    cy.get("#comment").clear();
    cy.wait(1000);
    cy.get("#observers").type(observer);
    cy.get("#comment").type(comment);
    cy.get("#selectType").click().get("#Vakio").click();
    cy.get("#selectLocation").click().get("#Bunkkeri").click();
    cy.get(".CodeMirror textarea").type(shorthand, { force: true });
    cy.wait(1000);
    cy.contains("Tallenna").click({ force: true });
    cy.wait(1000);
    cy.contains(date);

  });

  it("Shorthand modification window can be clicked", function () {
    cy.contains(date).click();
    cy.contains('Muokkaa').click();
    cy.contains("Tallenna");
    cy.contains("Peruuta");
    cy.contains("Poista");


  });

  it("Shorthand modification windows selections for type and location can be made", function () {
    cy.contains(date).click();
    cy.contains('Muokkaa').click();
    cy.get("#selectLocationInModification").click().get("#Bunkkeri").click();
    cy.get("#selectTypeInModification").click().get("#Vakio").click();
    cy.contains("Vakio");
    cy.contains("Bunkkeri");
    cy.contains("sommol 1/2 W");
  });

  it("In shorthand modification shorthand can be modified and saved", function () {
    cy.contains(date).click();
    cy.contains('Muokkaa').click();
    cy.get("#selectTypeInModification").click().get("#Vakio").click();
    cy.get("#selectLocationInModification").click().get("#Bunkkeri").click();
    cy.wait(2000);
    cy.get(".CodeMirror")
      .first()
      .then((editor) => {
        editor[0].CodeMirror.setValue("", { force: true });
      });
    cy.wait(2000);  
    cy.get(".CodeMirror textarea").type(shorthandModified, { force: true });
    cy.wait(1000);
    cy.contains("Tallenna").click({ force: true });
    cy.wait(5000);
    cy.contains("GRUGRU");
  });
});