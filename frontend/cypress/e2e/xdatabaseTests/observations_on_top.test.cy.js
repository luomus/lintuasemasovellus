import { myBeforeEach } from "../methods.js";


const date = "20.06.2022";
const comment = "Olipa kiva sää.";
const shorthand = "10:00\nsommol 1/2 W\n12:00";

const invalidShorthand0 = "10:30\nsommol 1/2 W\n15:00";
const invalidShorthand1 = "11:30\nsommol 1/2 W\n12:00";

describe("InvalidDataInShorthandOrLocationOrTypeOrObservers", function () {
  beforeEach(function () {
    myBeforeEach();
  });

  it("Observation with start/end time on top can't be saved", function () {
    cy.get("#date-picker-inline").clear();
    cy.get("#date-picker-inline").type(date);
    cy.get("#comment-header").click();
    cy.get("#comment").clear();
    cy.get("#comment").type(comment);
    cy.get("#selectType").click().get("#Vakio").click();
    cy.get("#selectLocation").click().get("#Bunkkeri").click();
    cy.get(".CodeMirror textarea").type(shorthand, { force: true });
    cy.wait(1000);
    cy.contains("Tallenna").click({ force: true });

    cy.get(".CodeMirror")
      .first()
      .then((editor) => {
        editor[0].CodeMirror.setValue("");
      });
    cy.get(".CodeMirror textarea").type(invalidShorthand0, { force: true });
    cy.wait(1000);
    cy.contains("Tallenna").click({ force: true });
    cy.wait(1000);
    cy.get("#saveButton").should("be.disabled");
    cy.get(".CodeMirror")
      .first()
      .then((editor) => {
        editor[0].CodeMirror.setValue("");
      });
    cy.get(".CodeMirror textarea").type(invalidShorthand1, { force: true });
    cy.wait(1000);
    cy.contains("Tallenna").click({ force: true });
    cy.wait(1000);
    cy.get("#saveButton").should("be.disabled");
  });

});
