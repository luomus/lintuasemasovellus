import { myBeforeEach } from "../methods.js";

const date = "01.01.2020";
const dateNext = "02.01.2020";
const observer = "Helmi Havainnoitsija";
const comment = "Olipa kiva sää.";
const shorthand = "10:00\nsommol 1/2 W\n12:00";
const opened = "06:00";
const closed = "07:00";
const netCodes = "abcde";

describe("CopyYesterdaysData", function () {
  beforeEach(function () {
    myBeforeEach();
  });

  it("Yesterdays's data can be copied to today", function () {
    cy.get("#date-picker-inline").clear();
    cy.get("#date-picker-inline").type(date);
    cy.get("#observers").clear();
    cy.get("#comment-header").click();
    cy.get("#comment").clear();
    cy.get("#activity-header").click();
    cy.get("#attachments").clear();
    cy.wait(1000);
    cy.get("#observers").type(observer);
    cy.get("#comment").type(comment);
    cy.get("[name=standardRing]").click();
    cy.get("#attachments").type("1");
    cy.get("#selectType").click().get("#Vakio").click();
    cy.get("#selectLocation").click().get("#Bunkkeri").click();
    cy.get("#catches-header").click();
    cy.get("#plus-catch-row-button").click();
    cy.get("#selectCatchType").click();
    cy.contains("Vakioverkko").click();
    cy.get("#selectCatchArea").click();
    cy.contains("Vakioverkot K").click();
    cy.get("#opened").clear();
    cy.get("#opened").type(opened);
    cy.get("#closed").clear();
    cy.get("#closed").type(closed);
    cy.get("#selectCatchCount").type("2");
    cy.get("#netCodes").type(netCodes);
    cy.get(".CodeMirror textarea").type(shorthand, { force: true });
    cy.wait(1000);
    cy.contains("Tallenna").click({ force: true });
    cy.wait(5000);

    cy.get("#date-picker-inline").clear();
    cy.get("#date-picker-inline").type(dateNext);
    cy.get("#open-copy-button").click();
    cy.get("#copy-observers-box").click();
    cy.get("#copy-comment-box").click();
    cy.get("#copy-activity-box").click();
    cy.get("#copy-catches-box").click();


    cy.get("#confirm-copy-button").click();
    cy.get("#observers").contains("Helmi Havainnoitsija")

  });

})