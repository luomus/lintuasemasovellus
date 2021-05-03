import { myBeforeEach } from "../methods.js";


const date = "02.01.2020";
const observer = "Hilla Havainnoitsija";
const comment = "Olipa kiva sää.";

const validShorthand0 = "10:00\nsommol 1/2 W\ncygcyg 3\n10:30"; //kaksi havaintoa periodilla
const validShorthand1 = "7.00\nsommol 1W\n8.00\n-\n9.00\ntauko\n10.00\nsommol 1E\n11.00"; //tauko ja tyhjä väli samassa shorthandissa
const validShorthand2 = "07.00\ngrugru 100SW+-, 200 S +++ ,  300 \"W---\nsommol 1/2 W\n08.00\n10.00\nsommol 1/2 W\n11.00\n11.00\nSommol /4 E\nAnacre 1\"2juv3subad/W\nMeralb /1W, 2/E, 3/4w\n13.00";
//pidempi pikakirjoitus yksityiskohdilla
const validShorthand3 = "9:00\nsommol 2/3\n09:30"; //aika kirjoitettu ilman alkunollaa ja sen kanssa
const validShorthand4 = "09:00\nsommol 2/3\n9:30"; //aika kirjoitettu alkunollalla ja ilman
const validShorthand5 = "9:30\nsommol 2/3\n10:00"; //yksinumeroinen aloitus, kaksinumeroinen lopetus
const validShorthand6 = "09:30\nsommol 2/3\n10:00"; //yksinumeroinen aloitus nollalla, kaksinumeroinen lopetus
const validShorthand7 = "03:30\nsommol 2/3 (kommentti)\n04:00"; //kommentti
const validShorthand8 = "03:30\nSOMMOL 2/3\n04:00"; //isolla kirjoitettu
const validShorthand9 = "03:30\nSommol 2/3\n04:00"; //iso alkukirjain
const validShorthand10 = "03:00\nSommol 1\"2'3subad/2\" sw\n03:30"; //useita ikäluokkia

const shorthands = [validShorthand0, validShorthand1,
  validShorthand2, validShorthand3, validShorthand4, validShorthand5,
  validShorthand6, validShorthand7, validShorthand8, validShorthand9,
  validShorthand10];

describe("validShorthand", function () {
  beforeEach(function () {
    myBeforeEach();
  });

  it("Tallenna button will activate if shorthand is valid", function () {

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
      cy.get("#saveButton").should("not.be.disabled");
    }
  });

});