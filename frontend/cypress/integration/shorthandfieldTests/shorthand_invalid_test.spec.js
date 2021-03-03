import { myBeforeEach } from "../methods.js";


const date = "02.01.2020";
const observer = "Hilla Havainnoitsija";
const comment = "Olipa kiva sää.";
const shorthand = "10:00\nsommol 1/2 W\n12:00";

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
const invalidShorthand13 = "10.00\nsommol 1/2 W\n11.00\nSommol /4 E\nAnacre 1\"2juv3subad/W\nMeralb /1W, 2/E, 3/4w\n13.00\n07.00\ngrugru 100SW+-, 200 S +++ ,  300 \"W---\nsommol 1/2 W\n08.00";//välikellonaika poistettu
const invalidShorthand14 = "12:00\nsommolo 1/2 W\n10:00"; //kellonajat väärinpäin

const shorthands = [invalidShorthand0, invalidShorthand1,
  invalidShorthand2, invalidShorthand3, invalidShorthand4, invalidShorthand5,
  invalidShorthand6, invalidShorthand7, invalidShorthand8,
  invalidShorthand10, invalidShorthand11,  invalidShorthand13,
  invalidShorthand14];

describe("InvalidDataInShorthandOrLocationOrTypeOrObservers", function() {
  beforeEach(function() {
    myBeforeEach();
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

});