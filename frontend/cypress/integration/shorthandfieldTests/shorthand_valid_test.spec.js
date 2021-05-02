import { myBeforeEach } from "../methods.js";


const date = "02.01.2020";
const observer = "Hilla Havainnoitsija";
const comment = "Olipa kiva sää.";

const validShorthand0 = "10:00\nsommol 1/2 W\ncygcyg 3\n10:30"; //kaksi havaintoa periodilla
const validShorthand1 = "7.00\nsommol 1W\n8.00\n-\n9.00\ntauko\n10.00\nsommol 1E\n11.00"; //tauko ja tyhjä väli samassa shorthandissa
const validShorthand2 = "07.00\ngrugru 100SW+-, 200 S +++ ,  300 \"W---\nsommol 1/2 W\n08.00\n10.00\nsommol 1/2 W\n11.00\n11.00\nSommol /4 E\nAnacre 1\"2juv3subad/W\nMeralb /1W, 2/E, 3/4w\n13.00"
//pidempi pikakirjoitus yksityiskohdilla

const shorthands = [validShorthand0, validShorthand1, validShorthand2];

describe("InvalidDataInShorthandOrLocationOrTypeOrObservers", function () {
  beforeEach(function () {
    myBeforeEach();
  });

  it("Tallenna button is not active if shorthand is invalid", function () {

    cy.get("#selectType").click().get("#Vakio").click();
    cy.get("#selectLocation").click().get("#Bunkkeri").click();
    cy.get("#comment-header").click();

    for (var i = 0; i < shorthands.length; i++) {

      //pikakirjoituskentän tyhjentäminen:
      cy.get(".CodeMirror")
        .first()
        .then((editor) => {
          editor[0].CodeMirror.setValue("");
        });

      cy.get("#date-picker-inline").clear();
      cy.get("#date-picker-inline").type(date);

      cy.get("#observers").clear();
      cy.get("#observers").type(observer);

      cy.get("#comment").clear();
      cy.get("#comment").type(comment);

      cy.get("#selectType").click().get("#Vakio").click();
      cy.get("#selectLocation").click().get("#Bunkkeri").click();

      cy.get(".CodeMirror textarea").type(shorthands[i], { force: true });
      cy.wait(1000);
      cy.get("#saveButton").should("not.be.disabled");
    }
  });

});