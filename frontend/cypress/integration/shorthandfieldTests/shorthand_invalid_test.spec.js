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
const invalidShorthand8 = "10:00\nsommol 1/2 W\n12:0\n0";//rivinvaihto väärässä paikassa
const invalidShorthand9 = "10:00\nsommol 1/2 WW\n12:00"; //virheellinen ilmansuunta
const invalidShorthand10 = "12:00\nsommol 1/2 W\n10:00"; //kellonajat väärinpäin
const invalidShorthand11 = "10:00\ntauko\n12:00"; //pelkkä tauko
const invalidShorthand12 = "10:00\n12:00"; //vain kellonaikoja
const invalidShorthand13 = "10:00\n-\ngrugru 2\n12:00"; //havaintoja periodilla tyhjän merkin jälkeen
const invalidShorthand14 = "10:00\ngrugru 2\n-\n12:00"; //havaintoja periodilla ennen tyhjää merkkiä
const invalidShorthand15 = "10:00\ntauko\nsommol 1/2 W\n12:00"; //havaintoja periodilla taukomerkin jälkeen
const invalidShorthand16 = "10:00\nsommol 1/2 W\ntauko\n12:00"; //havaintoja periodilla ennen taukomerkkiä
const invalidShorthand17 = "-\n10:00\nsommol 1/2 W\n12:00"; //tyhjä ennen aikoja
const invalidShorthand18 = "10:00\nsommol 1/2 W\n12:00\n-"; //tyhjä aikojen jälkeen
const invalidShorthand19 = "tauko\n10:00\nsommol 1/2 W\n12:00"; //tauko ennen aikoja
const invalidShorthand20 = "10:00\nsommol 1/2 W\n12:00\ntauko"; //tauko aikojen jälkeen
const invalidShorthand21 = "10:00\ntauko\n-\n12:00"; //tauko ja tyhjä samassa
const invalidShorthand22 = "10:00\n-\ntauko\n12:00"; //tyhjä ja tauko samassa
const invalidShorthand23 = "10:00\nsommol 1W/\n10:30"; //ilmansuunta ennen lukumäärän loppua
const invalidShorthand24 = "10:00\ngrugru 100-200SW+-\n10:30"; //ohituspuoli välissä ilman pilkkua
const invalidShorthand25 = "10:00\ngrugru 100SW ,,, ,200S\n10:30"; //liikaa pilkkuja

const shorthands = [invalidShorthand0, invalidShorthand1,
  invalidShorthand2, invalidShorthand3, invalidShorthand4, invalidShorthand5,
  invalidShorthand6, invalidShorthand7, invalidShorthand8, invalidShorthand9,
  invalidShorthand10, invalidShorthand11, invalidShorthand12, invalidShorthand13,
  invalidShorthand14, invalidShorthand15, invalidShorthand16, invalidShorthand17,
  invalidShorthand18, invalidShorthand19, invalidShorthand20, invalidShorthand21,
  invalidShorthand22, invalidShorthand23, invalidShorthand24, invalidShorthand25];

describe("InvalidDataInShorthandOrLocationOrTypeOrObservers", function () {
  beforeEach(function () {
    myBeforeEach();
  });

  it("Tallenna button is not active if shorthand is invalid", function () {

    cy.get("#selectType").click().get("#Vakio").click();
    cy.get("#selectLocation").click().get("#Bunkkeri").click();
    cy.get("#comment-header").click();
    cy.get("#date-picker-inline").clear();
    cy.get("#date-picker-inline").type(date);
    cy.get("#observers").clear();
    cy.get("#observers").type(observer);
    cy.get("#comment").clear();
    cy.get("#comment").type(comment);

    for (var i = 0; i < shorthands.length; i++) {

      //pikakirjoituskentän tyhjentäminen:
      cy.get(".CodeMirror")
        .first()
        .then((editor) => {
          editor[0].CodeMirror.setValue("");
        });

      cy.get(".CodeMirror textarea").type(shorthands[i], { force: true });
      cy.wait(1500);
      cy.get("#saveButton").should("be.disabled");
    }
  });

  it("Tallenna button is not active if observers is left empty", function () {

    cy.get("#date-picker-inline").clear();
    cy.get("#date-picker-inline").type(date);
    cy.get("#observers").clear();
    cy.get("#comment-header").click();
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
    cy.get("#observers").type(observer);
    cy.get("#comment-header").click();
    cy.get("#comment").type(comment);
    cy.get("#selectLocation").click().get("#Bunkkeri").click();
    cy.get(".CodeMirror textarea").type(shorthand, { force: true });
    cy.wait(1000);

    cy.get("#saveButton").should("be.disabled");
  });

  it("Tallenna button is not active if location is not selected", function () {

    cy.get("#date-picker-inline").clear();
    cy.get("#date-picker-inline").type(date);
    cy.get("#observers").type(observer);
    cy.get("#comment-header").click();
    cy.get("#comment").type(comment);
    cy.get("#selectType").click().get("#Vakio").click();
    cy.get(".CodeMirror textarea").type(shorthand, { force: true });
    cy.wait(1000);

    cy.get("#saveButton").should("be.disabled");
  });

});