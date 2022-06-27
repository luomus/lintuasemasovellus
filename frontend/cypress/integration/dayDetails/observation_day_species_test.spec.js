import { myBeforeEach } from "../methods.js";

const observatory = "Hangon Lintuasema";
const date = "27.06.2022";
const observer = "Aku Ankka";
const basic1 = "GALGAL";
const basic2 = "SOMMOL";
const other1 = "CYGCOL";
const other2 = "PARCYA";
const shorthand = `10:00\n${basic1} 1/2 W (note, 123)\n12:00\n13:30\n${other1} 4/3 N\n14:05`;

const addObsrvations = () => {
  cy.get("#date-picker-inline").clear();
  cy.get("#date-picker-inline").type(date);
  cy.get("#observers").clear();
  cy.get("#observers").type(observer);
  cy.get("#selectType").click().get("#Vakio").click();
  cy.get("#selectLocation").click().get("#Bunkkeri").click();
  cy.get(".CodeMirror textarea").type(shorthand, { force: true });
  cy.wait(1000);
  cy.contains("Tallenna").click({ force: true });
  cy.wait(5000);
}

const chooseSpeciesType = (type) => {
  cy.get("#select-species-list")
    .click()
    .get(`[data-value="${type}"]`)
    .click();
}

const selectAllRows = () => {
  cy.get('[aria-label="rows per page"]').select("Kaikki");
}

const assertThatSpeciesTableBodyHasNumberOfRows = (value) => {
  cy.get("#speciesTable")
    .get("tbody")
    .find("tr")
    .should("have.length", value);
}

describe("Species table with filters contains species as expected", function () {
  before(function () {
    myBeforeEach(); //Logs in, chooses station
    cy.should("contain", observatory); //prerequisite for tests, expected to use Hangon_Lintuasema
    addObsrvations();
  });

  beforeEach(function () {
    cy.contains("Viimeisimmät päivät")
      .parent()
      .contains(date)
      .click();
  })

  afterEach(function () {
    cy.get('[alt="haukka"]').click();
  })

  it(`Basic species table 
      with only observations filter enabled 
      contains added basic observation 
      but not one that has no observations`,
    function () {
      cy.get("#onlyObservationsFilter").check();

      cy.get("#speciesTable")
        .should("contain", basic1)
        .and("not.contain", basic2);
    });

  it(`Other species table
      with only observations filter enabled
      contains added other observation 
      but not one that has no observations`,
    function () {
      chooseSpeciesType("others");

      cy.get("#onlyObservationsFilter").check();

      cy.get("#speciesTable")
        .should("contain", other1)
        .and("not.contain", other2);
    });

  it(`Basic species table 
      with only observations filter disabled
      and with all rows selected
      contains added basic observation 
      and one that has no observations
      but no chosen others`,
    function () {
      cy.get("#onlyObservationsFilter").uncheck();

      selectAllRows();

      cy.get("#speciesTable")
        .should("contain", basic1, basic2)
        .and("not.contain", other1, other2);
    });

  it(`Other species table 
      with only observations filter disabled
      and with all rows selected
      contains added other observation 
      and one that has no observations
      but no chosen basics`,
    function () {
      chooseSpeciesType("others");

      cy.get("#onlyObservationsFilter").uncheck();

      selectAllRows();

      cy.get("#speciesTable")
        .should("not.contain", basic1, basic2)
        .and("contain", other1, other2);
    });

  it(`All species table 
      with only observations filter disabled
      and with all rows selected
      contains added basic and other observations
      and the ones that have no observations`,
    function () {
      chooseSpeciesType("all");

      cy.get("#onlyObservationsFilter").uncheck();

      selectAllRows();

      cy.get("#speciesTable")
        .should("contain", basic1, basic2, other1, other2);
    });

  it(`Basic species table 
      with only observations filter disabled
      and with all rows selected
      contains 236 rows`,
    function () {
      cy.get("#onlyObservationsFilter").uncheck();

      selectAllRows();

      assertThatSpeciesTableBodyHasNumberOfRows(236);
    });

  it(`Other species table 
      with only observations filter disabled
      and with all rows selected
      contains 381 rows`,
    function () {
      chooseSpeciesType("others");

      cy.get("#onlyObservationsFilter").uncheck();

      selectAllRows();

      assertThatSpeciesTableBodyHasNumberOfRows(381);
    });

  it(`All species table 
      with only observations filter disabled
      and with all rows selected
      contains 617 rows`,
    function () {
      chooseSpeciesType("all");

      cy.get("#onlyObservationsFilter").uncheck();

      selectAllRows();

      assertThatSpeciesTableBodyHasNumberOfRows(617);
    });
});