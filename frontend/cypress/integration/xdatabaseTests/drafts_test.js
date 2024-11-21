import { myBeforeEach } from "../methods.js";

const date = "11.11.1911";
const observer = "David Drafter";
const comment = "dis is a comment";
const shorthand = "10:00\nsommol 1\n12:00";

describe("Drafts", function () {
  beforeEach(function () {
    myBeforeEach();
  });

  it("Drafts are saved", function () {
    cy.get("#date-picker-inline").clear();
    cy.get("#date-picker-inline").type(date);
    cy.get("#observers").clear();
    cy.get("#observers").type(observer);
    cy.get("#comment-header").click();
    cy.get("#comment").clear();
    cy.get("#comment").type(comment);
    cy.get("#selectType").click().get("#Vakio").click();
    cy.get("#selectLocation").click().get("#Bunkkeri").click();
    cy.get(".CodeMirror textarea").type(shorthand, { force: true });
    cy.wait(1000);

    cy.get("#open-draft-button").click();
    cy.wait(500);
    cy.get("[role=dialog]").find("table").find("tr").its("length").should("be.gte", 2);
  });

  it("Draft is removed after successfully submitting it", () => {
    cy.get("#date-picker-inline").clear();
    cy.get("#date-picker-inline").type(date);
    cy.get("#observers").clear();
    cy.get("#observers").type(observer);
    cy.get("#comment-header").click();
    cy.get("#comment").clear();
    cy.get("#comment").type(comment);
    cy.get("#selectType").click().get("#Vakio").click();
    cy.get("#selectLocation").click().get("#Bunkkeri").click();
    cy.get(".CodeMirror textarea").type(shorthand, { force: true });
    cy.wait(1000);
    cy.get("#open-draft-button").click();
    cy.wait(500);
    cy.get("[role=dialog]").find("table").find("tr").its("length").then(a => {
      cy.wait(500);
      cy.contains("Peruuta").click({ force: true });
      cy.wait(500);
      cy.root().get("#saveButton").click({ force: true });
      cy.wait(500);
      cy.root().get("#open-draft-button").click();
      cy.wait(500);
      cy.get("[role=dialog]").find("table").find("tr").its("length").should("be.lt", a);
    });
  });

  it("Drafts can be applied", () => {
    cy.get("#open-draft-button").click();
    cy.wait(500);
    cy.get("[role=dialog]").find("table").find("#confirm-draft-button").click();
    cy.wait(500);
    cy.get("#observers").should("have.value", observer);
    cy.get("#comment").should("have.value", comment);
    // TODO fix
    // cy.get("#selectType").should("have.value", "#Vakio");
    // cy.get("#selectLocation").should("have.value", "#Bunkkeri");
    // Also for day.
    cy.get(".CodeMirror")
      .first()
      .then((editor) => {
        expect(editor[0].CodeMirror.getValue()).to.equal(shorthand);
      });
  });

  it("Drafts can be deleted invidually", () => {
    cy.get("#open-draft-button").click();
    cy.wait(500);
    cy.get("[role=dialog]").find("table").find("tr").its("length").then(a => {
      cy.get("[role=dialog]").find("table").find("#delete-draft-button").click();
      cy.wait(666);
      cy.get("[role=dialog]").find("table").find("tr").its("length").should("be.lt", a);
    });
  });

  it("Drafts can be deleted as whole", () => {
    cy.on("window:confirm", () => true);
    cy.get("#open-draft-button").click();
    cy.wait(500);
    cy.get("[role=dialog]").find("table").find("tr").its("length").should("be.gte", 1);
    cy.get("#delete-all-button").click();
    cy.wait(1000);
    cy.get("[role=dialog]").find("table").find("tr").its("length").should("eq", 1); // only header
  });

});
