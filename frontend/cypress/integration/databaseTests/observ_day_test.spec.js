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
const invalidShorthand = "10:00\nsommol 1/2 W\n";


const invalidShorthand0 = "10:00\nsommol 1/2 W\n"; //puuttuva kellonaika
const invalidShorthand1 = "10:00\nsammal 1/2 W\n12:00"; //epäkelpo lajilyhenne
const invalidShorthand2 = "10:00\nsommol 1/2 W\n42:00"; //virheellinen kellonaika
const invalidShorthand3 = " ";//tyhjä pikakirjoitus
const invalidShorthand4 = "\nsommol 1/2 W\n"; //ei kellonaikaa
const invalidShorthand5 = "10:00\nsommolo 1/2 W\n12:00"; //liikaa merkkejä lajinimessä
const invalidShorthand6 = "10:00\nosommol 1/2 W\n12:00"; //liikaa merkkejä lajinimessä

const invalidShorthand7 = "10:00\nsommo 1/2 W\n12:00"; //invalid lajinimi
const invalidShorthand8 = "10:00\nsommol 1/2 W\n12:00\nsommol 3/4 W \n13:00"; //pariton määrä kellonaikoja
const invalidShorthand10 = "10:00\nsommol 1/2 W\n12:0\n0";//rivinvaihto väärässä paikassa
const invalidShorthand11 = "10:00\nsommol 1/2 WW\n12:00"; //virheellinen ilmansuunta
//const invalidShorthand12 = "10:00\nsommol 1/2/ W\n12:00"; //ylimääräinen kauttaviiva
const invalidShorthand13 = "10.00\nsommol 1/2 W\n11.00\nSommol /4 E\nAnacre 1\"2juv3subad/W\nMeralb /1W, 2/E, 3/4w\n13.00\n07.00\ngrugru 100SW+-, 200 S +++ ,  300 \"W---\nsommol 1/2 W\n08.00";//välikellonaika poistettu
const invalidShorthand14 = "12:00\nsommolo 1/2 W\n10:00"; //kellonajat väärinpäin

//talteen toimiva: const invalidShorthand13 = "10.00\nsommol 1/2 W\n11.00\n11.00\nSommol /4 E\nAnacre 1\"2juv3subad/W\nMeralb /1W, 2/E, 3/4w\n13.00\n07.00\ngrugru 100SW+-, 200 S +++ ,  300 \"W---\nsommol 1/2 W\n08.00";//megapitkä pikakirjoitus

const shorthands = [invalidShorthand0, invalidShorthand1,
  invalidShorthand2, invalidShorthand3, invalidShorthand4, invalidShorthand5,
  invalidShorthand6, invalidShorthand7, invalidShorthand8,
  invalidShorthand10, invalidShorthand11,  invalidShorthand13,
  invalidShorthand14];

//invalidShorthand12, lisätään ylläolevaan taulukkoon, kun ylimääräinen kauttaviivabugivalidointi korjattu


describe("AddObservationDay", function() {
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


  it("An observation and observation day can be saved on firstpage for Vakio", function() {

    cy.get("#date-picker-inline").clear();
    cy.get("#date-picker-inline").type(date);
    cy.get ("#observers").clear();
    cy.get ("#comment").clear();
    cy.wait(1000);
    cy.get ("#observers").type(observer);
    cy.get("#comment").type(comment);
    cy.get("#selectType").click().get("#Vakio").click();
    cy.get("#selectLocation").click().get("#Bunkkeri").click();
    cy.get(".CodeMirror textarea").type(shorthand, { force: true });
    cy.wait(1000);
    cy.contains("Tallenna").click({ force: true });
    cy.wait(1000);


  });

  it("Day and period has been added for Vakio", function() {
    cy.get("#navigationbar").click();
    cy.contains("Näytä päivät").click();
    cy.contains(observer);
    cy.contains(comment);
    cy.contains(observStation);
    cy.contains(date);

  });

  it("Observation can be opened to a new page", function() {
    cy.get("#navigationbar").click();
    cy.contains("Näytä päivät").click();
    cy.contains("Hilla Havainnoitsija").click();
    cy.get("#periodsButton").click();
    cy.wait(1000);
    cy.contains("Bunkkeri");
    cy.contains("10:00");
  });

  it("Comment and observer can be edited", function() {
    cy.get("#navigationbar").click();
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


  it("An observation and observation day can be saved on firstpage for something else than vakio", function() {
    cy.get("#observatorySelector").click();
    cy.get("#select-observatory").click().get("ul > li").eq(1).click();
    cy.get("#submit").contains("Tallenna").click();

    cy.get("#date-picker-inline").clear();
    cy.get("#date-picker-inline").type(date2);
    cy.wait(1000);
    cy.get ("#observers").type(observer1);
    cy.get("#comment").type(comment1);
    cy.get("#selectType").click().get("#Esimerkki1").click();
    cy.get("#selectLocation").click().get("#Länsireitti").click();
    cy.get(".CodeMirror textarea").type(shorthand, { force: true });
    cy.wait(1000);
    cy.contains("Tallenna").click({ force: true });


  });

  it("Day and period for non-Vakio has been added for observationlist", function() {
    cy.get("#observatorySelector").click();
    cy.get("#select-observatory").click().get("ul > li").eq(1).click();
    cy.get("#submit").contains("Tallenna").click();

    cy.get("#navigationbar").click();
    cy.contains("Näytä päivät").click();
    cy.contains(observer).should("not.exist");
    cy.contains(observer1).click();
    cy.get("#periodsButton").click();
    cy.contains("Länsireitti");
    cy.contains("Esimerkki1");


  });


  it("Tallenna button is not active if shorthand is invalid", function () {

    cy.get("#selectType").click().get("#Vakio").click();
    cy.get("#selectLocation").click().get("#Bunkkeri").click();

    for (var i = 0; i < shorthands.length; i++) {

      //pikakirjoituskentän tyhjentäminen:
      cy.get(".CodeMirror")
        .first()
        .then((editor) => {
          editor[0].CodeMirror.setValue("");
        });

      cy.get("#date-picker-inline").clear();
      cy.get("#date-picker-inline").type(date);

      cy.get ("#observers").clear();
      cy.get ("#observers").type(observer);

      cy.get("#comment").clear();
      cy.get("#comment").type(comment);

      cy.get("#selectType").click().get("#Vakio").click();
      cy.get("#selectLocation").click().get("#Bunkkeri").click();

      cy.get(".CodeMirror textarea").type(shorthands[i], { force: true });
      cy.wait(1000);
      cy.get("#saveButton").should("be.disabled");
    }
  });

  it("Tallenna button is not active if observers is left empty", function () {

    cy.get("#date-picker-inline").clear();
    cy.get("#date-picker-inline").type(date);
    cy.get ("#observers").clear();
    cy.get("#comment").clear();
    cy.get("#comment").type(comment);
    cy.get("#selectType").click().get("#Vakio").click();
    cy.get("#selectLocation").click().get("#Bunkkeri").click();
    cy.get(".CodeMirror textarea").type(shorthand, { force: true });
    cy.wait(1000);

    cy.get("#saveButton").should("be.disabled");
  });


  it("Tallenna button is not active if type is not selected", function () {

    cy.get("#date-picker-inline").clear();
    cy.get("#date-picker-inline").type(date);
    cy.get ("#observers").type(observer);
    cy.get("#comment").type(comment);
    cy.get("#selectLocation").click().get("#Bunkkeri").click();
    cy.get(".CodeMirror textarea").type(shorthand, { force: true });
    cy.wait(1000);

    cy.get("#saveButton").should("be.disabled");
  });

  it("Tallenna button is not active if location is not selected", function () {

    cy.get("#date-picker-inline").clear();
    cy.get("#date-picker-inline").type(date);
    cy.get ("#observers").type(observer);
    cy.get("#comment").type(comment);
    cy.get("#selectType").click().get("#Vakio").click();
    cy.get(".CodeMirror textarea").type(shorthand, { force: true });
    cy.wait(1000);

    cy.get("#saveButton").should("be.disabled");
  });

  it("Observation list only shows observations from chosen observatory", function () {

    cy.get("#date-picker-inline").clear();
    cy.get("#date-picker-inline").type(date);
    cy.get("#observers").type(observer);
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
    cy.get("#observers").type(observer);
    cy.get("#comment").type(comment);
    cy.get("#selectType").click().get("#Vakio").click();
    cy.get("#selectLocation").click().get("#Länsireitti").click();
    cy.get(".CodeMirror textarea").type(shorthand, { force: true });
    cy.wait(1000);
    cy.contains("Tallenna").click({ force: true });


    cy.get("#navigationbar").click();
    cy.contains("Näytä päivät").click();
    cy.contains(date).should("not.exist");
    cy.contains(date2);
  });


});