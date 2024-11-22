import { myBeforeEach } from "../methods.js";


const date = "03.03.2021";
const observer = "Aarni Apulaishavainnoitsija";
const comment = "Olipa sateinen sää.";
const shorthand = "10:00\nsommol 1/2 W\n12:00";
const shorthandNight = "01:00\ngrugru 1/2 W\n01:10";


describe("ShorthandModificationPerObservationPeriod", function () {

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
    cy.wait(1000);
    cy.contains("Jaksot").click();
    cy.wait(1000);
    cy.get("#editObsPeriod").click();
    cy.contains("Tallenna");
    cy.contains("Peruuta");
    cy.contains("Poista");
  });

  it("In shorthand modification type, location and shorthand can be modified and saved", function () {
    cy.contains(date).click();
    cy.wait(1000);
    cy.contains("Jaksot").click();
    cy.wait(1000);
    cy.get("#editObsPeriod").click();
    cy.get("#selectTypeInModification").click().get("#Yömuutto").click();
    cy.get("#selectLocationInModification").click().get("#Piha").click();
    cy.wait(2000);
    cy.get(".CodeMirror")
      .first()
      .then((editor) => {
        editor[0].CodeMirror.setValue("", { force: true });
      });
    cy.wait(2000);
    cy.get(".CodeMirror textarea").type(shorthandNight, { force: true });
    cy.wait(1000);
    cy.contains("Tallenna").click({ force: true });
    cy.wait(5000);
    cy.contains("Yömuutto");
    cy.contains("Piha");
    cy.contains("Lajit").click();
    cy.wait(1000);
    cy.get("#onlyObservationsFilter").check();
    cy.wait(1000);
    cy.contains("GRUGRU");
  });
});
