import { myBeforeEach } from "../methods.js";


const observStation = "Hangon Lintuasema";
const date = "01.01.2020";
const observer = "Hilla Havainnoitsija";
const observer1 = "ONan Observoija";
const changedObserver= "Aarni Apulaishavainnoitsija";
const comment = "Olipa kiva sää.";
const comment1="Satoi aivan kaatamalla";
const changedComment= "hihihi asdfsommol";
const date2 = "02.02.2020";
const shorthand = "10:00\nsommol 1/2 W\n12:00";



describe("AddObservationDay", function() {
  beforeEach(function() {
    myBeforeEach();
  });


  it("An observation and observation day can be saved on firstpage for Vakio", function() {

    cy.get("#date-picker-inline").clear();
    cy.get("#date-picker-inline").type(date);
    cy.get("#observers").clear();
    cy.get("#comment").clear();
    cy.get("#liitteet").clear();
    cy.wait(1000);
    cy.get("#observers").type(observer);
    cy.get("#comment").type(comment);
    cy.get("[name=rengastusvakio]").click();
    cy.get("#liitteet").type("1");
    cy.get("#selectType").click().get("#Vakio").click();
    cy.get("#selectLocation").click().get("#Bunkkeri").click();
    cy.get(".CodeMirror textarea").type(shorthand, { force: true });
    cy.wait(1000);
    cy.contains("Tallenna").click({ force: true });
    cy.wait(5000);
    cy.contains(date);

  });



  it("Day can be clicked on first page", function() {

    cy.contains(date).click();
    cy.contains(observer);
    cy.contains(comment);
    cy.get("[name=check]").should("have.length", 1);
    cy.contains(observStation);
    cy.contains(date);

  });



  it("Day and period has been added for Vakio", function() {
    cy.contains("Näytä päivät").click();
    cy.contains(observer);
    cy.contains(comment);
    cy.contains(observStation);
    cy.contains(date);

  });


  it("Observation can be opened to a new page", function() {
    cy.contains("Näytä päivät").click();
    cy.contains("Hilla Havainnoitsija").click();
    cy.get("#periodsButton").click();
    cy.get("[name=check]").should("have.length", 1);
    cy.get("[name=attachments]").should("have.value", "1 kpl");
    cy.wait(1000);
    cy.contains("Bunkkeri");
    cy.contains("10:00");
  });

  it("Comment and observer can be edited", function() {
    cy.contains("Näytä päivät").click();
    cy.contains("Hilla Havainnoitsija").click();
    cy.get("#commentButton").click();
    cy.get("#commentField").clear();
    cy.get("#commentField").type(changedComment);
    cy.get("#commentSubmit").click();
    cy.contains(changedComment);
    cy.contains(comment).should("not.exist");

    cy.get("#commentButton").click();
    cy.get("#commentField").clear();
    cy.get("#commentField").type(comment);
    cy.get("#commentSubmit").click();
    cy.contains(comment);
    cy.contains(changedComment).should("not.exist");

    cy.get("#observerButton").click();
    cy.get("#observerField").clear();
    cy.get("#observerField").type(changedObserver);
    cy.get("#observerSubmit").click();
    cy.contains(changedObserver);
    cy.contains(observer).should("not.exist");


    cy.get("#observerButton").click();
    cy.get("#observerField").clear();
    cy.get("#observerField").type(observer);
    cy.get("#observerSubmit").click();
    cy.contains(observer);
    cy.contains(changedObserver).should("not.exist");
  });

  it("Daily actions can be edited", function() {
    cy.contains("Näytä päivät").click();
    cy.contains("Hilla Havainnoitsija").click();
    cy.get("#actionsButton").click();
    cy.get("[name=vakiohavainto]").click();
    cy.get("#liitteet").clear();
    cy.get("#liitteet").type("2");
    cy.get("#actionsEditSave").click();
    cy.wait(1000);
    cy.get("[name=check]").should("have.length", 2);
    cy.get("[name=attachments]").should("have.value", "2 kpl");
  });


  it("An observation and observation day can be saved on firstpage for something else than vakio", function() {
    cy.get("#observatorySelector").click();
    cy.get("#select-observatory").click().get("ul > li").eq(1).click();
    cy.get("#submit").contains("Tallenna").click();

    cy.get("#date-picker-inline").clear();
    cy.get("#date-picker-inline").type(date2);
    cy.wait(1000);
    cy.get("#observers").clear();
    cy.get("#observers").type(observer1);
    cy.get("#comment").clear();
    cy.get("#comment").type(comment1);
    cy.get("#selectType").click().get("#Esimerkki1").click();
    cy.get("#selectLocation").click().get("#Länsireitti").click();
    cy.get(".CodeMirror textarea").type(shorthand, { force: true });
    cy.wait(1000);
    cy.contains("Tallenna").click({ force: true });
    cy.wait(5000);
    cy.contains(date2);


  });

  it("Day and period for non-Vakio has been added for observationlist", function() {
    cy.get("#observatorySelector").click();
    cy.get("#select-observatory").click().get("ul > li").eq(1).click();
    cy.get("#submit").contains("Tallenna").click();
    cy.contains("Näytä päivät").click();
    cy.contains(observer).should("not.exist");
    cy.contains(observer1).click();
    cy.get("#periodsButton").click();
    cy.wait(1000);
    cy.contains("Länsireitti");
    cy.contains("Esimerkki1");


  });


  it("Observation list only shows observations from chosen observatory", function () {

    cy.get("#date-picker-inline").clear();
    cy.get("#date-picker-inline").type(date);
    cy.get ("#observers").clear();
    cy.get("#observers").type(observer);
    cy.get("#comment").clear();
    cy.get("#comment").type(comment);
    cy.get("#selectType").click().get("#Vakio").click();
    cy.get("#selectLocation").click().get("#Bunkkeri").click();
    cy.get(".CodeMirror textarea").type(shorthand, { force: true });
    cy.wait(1000);
    cy.contains("Tallenna").click({ force: true });

    cy.get("#observatorySelector").click();
    cy.get("#select-observatory").click();
    cy.contains("Jurmon Lintuasema").click();
    cy.get("#submit").contains("Tallenna").click();

    cy.get("#date-picker-inline").clear();
    cy.get("#date-picker-inline").type(date2);
    cy.get ("#observers").clear();
    cy.get("#observers").type(observer);
    cy.get("#comment").clear();
    cy.get("#comment").type(comment);
    cy.get("#selectType").click().get("#Vakio").click();
    cy.get("#selectLocation").click().get("#Länsireitti").click();
    cy.get(".CodeMirror textarea").type(shorthand, { force: true });
    cy.wait(1000);
    cy.contains("Tallenna").click({ force: true });

    cy.contains("Näytä päivät").click();
    cy.contains(date).should("not.exist");
    cy.contains(date2);
  });

  it("An invalid attachment amount has been overwritten at save", function () {
    cy.contains("Näytä päivät").click();
    cy.contains("Hilla Havainnoitsija").click();
    cy.get("#actionsButton").click();
    cy.get("#liitteet").clear();
    cy.get("#liitteet").type("-2");
    cy.get("#actionsEditSave").click();
    cy.wait(1000);
    cy.get("[name=attachments]").should("have.value", "0 kpl");
  });

});