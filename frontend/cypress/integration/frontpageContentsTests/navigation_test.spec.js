import { myBeforeEach } from "../methods.js";

describe("NavigatingFromFirstPageTest", function () {
  beforeEach(function () {
    myBeforeEach();
  });

  it("ToDayDetails Button navigates to chosen day's details", function() {
    const day = "27.05.2022";
    cy.get("#date-picker-inline").clear().type(day);
    cy.get("#toDayDetails").click();
    cy.url().should("include", "/#/daydetails/" + day);
    cy.contains("h2", day);
  });

  it("ToDayDetails Button saves values of modified observators, comment and actions fields and navigates to chosen day's details", function() {
    const day = "21.12.1998";
    const observers = "Liisa Lintubongari, Paavo Peippo";
    const comment = "Kolme yötä jouluun on. Laskin aivan itse eilen, kun näin talitintin."
    const activities = "standardObs, gåu";
    cy.get("#date-picker-inline").clear().type(day);
    cy.get("#observers").clear().type(observers);

    cy.get("#comment-header").click();
    cy.get("#comment").clear().type(comment);

    
    cy.get("#activity-header").click();
    //Needs to use the force when (un)checking boxes as there seems to be some overflow with some of the elements.
    cy.get('#activity-content').get('[type="checkBox"]').uncheck({force: true});
    cy.get('#activity-content').get('input[name="standardObs"]').check();
    cy.get('#activity-content').get('input[name="gåu"]').check();
    cy.get('#activity-content').get('input[name="owlStandard"]').check({force: true});
    

    cy.get("#toDayDetails").click();
    cy.url().should("include", "/#/daydetails/" + day);
    cy.get("[id=dayAndObservatory]").contains(day);
    cy.get("[id=observers").contains(observers);
    cy.get("[id=comment]").contains(comment);
    cy.get("[id=dailyActions]").get("svg[name=check]").should("have.length", 3);
  });

});