import { myBeforeEach } from "../methods.js";

const date = "1.6.2022";
const observer = "Pekka Puupaa";
const shorthand = "10:00\nsommol 1/2 W\n12:00";



describe.skip("When nightmigration", function () {
  beforeEach(function () {
    myBeforeEach();
  });

  it.skip("Tallenna button is not active if it is not night time", function () {

    cy.get("#date-picker-inline").clear();
    cy.get("#date-picker-inline").type(date);
    cy.get("#observers").type(observer);
    cy.get("#selectType").click().get("#Yömuutto").click();
    cy.get(".CodeMirror textarea").type(shorthand, { force: true });
    cy.wait(1000);

    cy.get("#saveButton").should("be.disabled");
  });
  it('hello there', function() {
    expect(true).toBe(true);
  });

});