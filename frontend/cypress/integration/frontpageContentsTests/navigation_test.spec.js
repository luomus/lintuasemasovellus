import { myBeforeEach } from "../methods.js";

describe("NavigatingFromFirstPageTest", function () {
  beforeEach(function () {
    myBeforeEach();
  });

  it("ToDayDetails Button navigates to details of the chosen day", function() {
    const day = "27.05.2022";
    const observers = "Hannu Hanhi";

    cy.get("#date-picker-inline").clear().type(day);
    cy.get("#observers").clear().type(observers);
    cy.get("#toDayDetails").click();
    cy.url().should("include", `/#/daydetails/${day}`);
    cy.contains("h2", day);
  });

  it("ToDayDetails Button is disabled if observers field is empty", function() {
    const day = "26.05.2022";

    cy.get("#date-picker-inline").clear().type(day);
    cy.get("#observers").clear();
    cy.get("#toDayDetails").should("be.disabled");
  });

  it("ToDayDetails button saves values of modified observators field but not comment and actions fields, then navigates to details of the chosen day", function() {
    const day = "21.12.1998";
    const observers = "Liisa Lintubongari, Paavo Peippo";
    const comment = "Kolme yötä jouluun on. Laskin aivan itse eilen, kun näin talitintin.";

    cy.get("#date-picker-inline").clear().type(day);
    cy.get("#observers").clear().type(observers);

    cy.get("#comment-header").click();
    cy.get("#comment").clear().type(comment);

    cy.get("#activity-header").click();
    //Need to use the force when (un)checking boxes as there seems to be some overflow with some of the elements.
    cy.get("#activity-content").get("[type=\"checkBox\"]").uncheck({ force: true });
    cy.get("#activity-content").get("input[name=\"standardObs\"]").check();
    cy.get("#activity-content").get("input[name=\"gåu\"]").check();
    cy.get("#activity-content").get("input[name=\"owlStandard\"]").check({ force: true });

    cy.get("#toDayDetails").click();
    cy.url().should("include", "/#/daydetails/" + day);
    cy.get("[id=dayAndObservatory]").contains(day);
    cy.get("[data-cy=observers").contains(observers);
    cy.get("[data-cy=comment]").should("not.contain", comment);
    cy.get("[id=dailyActions]").get("svg[name=check]").should("have.length", 0);
  });
});
