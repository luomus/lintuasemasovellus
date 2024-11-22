import { myBeforeEach } from "../methods.js";

const date = "28.06.2022";
const observer = "Tintti Tali";
const bird = "KT";
const migrantObs = 2;
const shorthand = `12.00\n${bird} ${migrantObs} (kommentti)\n13.00`;

const chooseSpeciesType = (type) => {
  cy.get("#select-species-list")
    .click()
    .get(`[data-value="${type}"]`)
    .click();
  cy.wait(1000);
};

const showAllBirdsWithObservations = () => {
  cy.get("#onlyObservationsFilter").check();
  chooseSpeciesType("all");
};

Cypress.Commands.add("getRowWithNote", (species) => {
  cy.get("#speciesTable")
    .contains(species.toUpperCase())
    .parent()
    .parent()
    .siblings();
});

const updateBird = (species, dataType, count) => {
  cy.getRowWithNote(bird)
    .find(`[name="${dataType}"]`)
    .type(`{selectAll}${count}`)
    .blur();

  cy.wait(3000);
};


const verifyTotalCount = (species, type, count) => {
  //If local use "localTotal" as type,
  //if migrant use "migrantTotal"
  cy.getRowWithNote(bird)
    .parent()
    .find(`[name="${type}"]`)
    .should("contain", count);
};

const setup = () => {
  myBeforeEach();
  cy.get("#date-picker-inline").clear();
  cy.get("#date-picker-inline").type(date);
  cy.get("#observers").clear();
  cy.get("#observers").type(observer);
  cy.get("#selectType").click().get("#Vakio").click();
  cy.get("#selectLocation").click().get("#Bunkkeri").click();
  cy.get(".CodeMirror textarea").type(shorthand, { force: true });
  cy.wait(1000);
  cy.contains("Tallenna").click({ force: true });
  cy.wait(3000);
};

const navigateToDayDetails = (day) => {
  cy.contains("Viimeisimmät päivät")
    .parent()
    .contains(day)
    .click();
  cy.wait(1000);
};

describe("Input of local observations and gåu observations", function () {
  before(function () {
    setup();
  });

  beforeEach(function () {
    myBeforeEach();
    navigateToDayDetails(date);
    showAllBirdsWithObservations();
  });

  it("Total will be equal to sum of local and gåu", function () {
    updateBird("kt", "localOther", 2);
    updateBird("kt", "localGau", 5);
    verifyTotalCount("kt", "localTotal", 7);
  });

  it("Total will be equal to sum of local and gåu", function () {
    updateBird("kt", "scatter", 1);
    verifyTotalCount("kt", "migrantTotal", 1+migrantObs);
  });

});
