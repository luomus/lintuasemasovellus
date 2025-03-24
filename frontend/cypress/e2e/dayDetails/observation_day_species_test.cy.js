import { myBeforeEach } from "../methods.js";

const date = "27.06.2022";
const observer = "Aku Ankka";
const basic1 = "GALGAL";
const basic2 = "SOMMOL";
const other1 = "CYGCOL";
const other2 = "PARCYA";
const shorthand = `10:00\n${basic1} 1/2 W (note, 123)\n12:00\n13:30\n${other1} 4/3 N\n14:05`;

const addObsrvations = () => {
  cy.inputDate(date);
  cy.get("#observers").clear();
  cy.get("#observers").type(observer);
  cy.get("#selectType").click().get("#Vakio").click();
  cy.get("#selectLocation").click().get("#Bunkkeri").click();
  cy.get(".CodeMirror textarea").type(shorthand, { force: true });
  cy.wait(1000);
  cy.contains("Tallenna").click({ force: true });
  cy.wait(5000);
};

const selectAllRows = () => {
  cy.get("[aria-label=\"rows per page\"]").select("Kaikki");
  cy.wait(1000);
};

describe("Species table with filters contains species as expected", function () {
  before(function () {
    myBeforeEach(); //Logs in, chooses station
    addObsrvations();
  });

  beforeEach(function () {
    myBeforeEach(); //Logs in, chooses station
    cy.contains("Viimeisimmät päivät")
      .parent()
      .contains(date)
      .click();
    cy.wait(1000);
  });

  it(`Species table
      with only observations filter enabled
      contains added basic observation
      but not one that has no observations`,
  function () {
    cy.get("#onlyObservationsFilter").check();

    cy.get("#speciesTable")
      .should("contain", basic1)
      .and("not.contain", basic2);
  });

  it(`Species table
      with only observations filter enabled
      contains added other observation
      but not one that has no observations`,
  function () {
    cy.get("#onlyObservationsFilter").check();

    cy.get("#speciesTable")
      .should("contain", other1)
      .and("not.contain", other2);
  });

  it(`Species table
      with only observations filter disabled
      and with all rows selected
      contains all basic observations and other that has observations`,
  function () {
    cy.get("#onlyObservationsFilter").uncheck();

    selectAllRows();

    cy.get("#speciesTable")
      .should("contain", basic1, basic2, other1)
      .and("not.contain", other2);
  });

});
