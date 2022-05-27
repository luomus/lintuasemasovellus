import { myBeforeEach } from "../methods.js";

describe.skip("Input of local observations and gåu observations", function () {
  beforeEach(function () {
    myBeforeEach();
  });

  it("Total will be equal to sum of local and gåu", function () {
    cy.get("input:local").get("kt").type("5");
    cy.get("input:gåu").get("kt").type("2");
    cy.get("total").get("kt").should("contain", "7");
  });

});