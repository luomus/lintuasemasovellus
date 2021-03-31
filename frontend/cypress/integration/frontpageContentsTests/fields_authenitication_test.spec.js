import { cyan } from "@material-ui/core/colors";
import { myBeforeEach } from "../methods.js";

const date = "01.01.2020";
const observer = "Hilla Havainnoitsija";
const comment = "Olipa kiva sää.";
const shorthand = "10:00\nsommol 1/2 W\n12:00";
const opened = "06:00";
const wrongOpened = "07:30";
const closed = "07:00";
const netCodes = "abcde";

describe("FieldsAndAuthenticationTest", function () {
  beforeEach(function () {
    myBeforeEach();
  });

  it("Catch row errors prevent saving", function () {
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
    cy.get(".CodeMirror textarea").type(shorthand, { force: true });
    cy.get("#catches-header").click();
    cy.get("#saveButton").should("not.be.disabled");
    cy.get("#plus-catch-row-button").click();
    cy.get("#saveButton").should("be.disabled");
    cy.get("#selectCatchType").click();
    cy.contains("Vakioverkko").click();
    cy.get("#saveButton").should("be.disabled");
    cy.get("#selectCatchArea").click();
    cy.contains("Vakioverkot K").click();
    cy.get("#opened").clear();
    cy.get("#opened").type(opened);
    cy.get("#closed").clear();
    cy.get("#closed").type(closed);
    cy.get("#selectCatchCount").clear();
    cy.get("#selectCatchCount").type("0");
    cy.get("#saveButton").should("be.disabled");
    cy.get("#selectCatchCount").clear();
    cy.get("#selectCatchCount").type("-3");
    cy.get("#saveButton").should("be.disabled");
    cy.get("#selectCatchCount").clear();
    cy.get("#selectCatchCount").type("2");
    cy.get("#saveButton").should("not.be.disabled");
    cy.get("#opened").clear();
    cy.get("#opened").type(wrongOpened);
    cy.get("#saveButton").should("be.disabled");
    cy.get("#opened").clear();
    cy.get("#opened").type(opened);
    cy.get("#netCodes").type(netCodes);
    cy.get("#saveButton").should("not.be.disabled");

  });

  it("Error messaging is correct", function () {
    cy.get("#date-picker-inline").clear();
    cy.get("#date-picker-inline").type(date);
    cy.get("#observers").clear();
    cy.get("#activity-header").click();
    cy.get("#attachments").clear();
    cy.wait(1000);
    cy.get("#observers").type(observer);
    cy.get("[name=standardRing]").click();
    cy.get("#attachments").type("-1");
    cy.contains("Negatiivinen arvo!");
    cy.get("#attachments").clear();
    cy.get("#attachments").type("1");
    cy.get("#selectType").click().get("#Vakio").click();
    cy.get("#selectLocation").click().get("#Bunkkeri").click();
    cy.get(".CodeMirror textarea").type(shorthand, { force: true });
    cy.get("#catches-header").click();
    cy.get("#saveButton").should("not.be.disabled");
    cy.get("#plus-catch-row-button").click();
    cy.get("#saveButton").should("be.disabled");
    cy.get("#selectCatchType").click();
    cy.contains("Petoverkot").click();
    cy.get("#saveButton").should("be.disabled");
    cy.get("#selectCatchArea").click();
    cy.contains("Muut petoverkot").click();
    cy.contains("Verkon 'Petoverkot' pituus on yleensä");
    cy.get("#opened").clear();
    cy.get("#opened").type(opened);
    cy.get("#closed").clear();
    cy.get("#closed").type(closed);
    cy.get("#saveButton").should("not.be.disabled");
    cy.get("#selectCatchCount").clear();
    cy.get("#selectCatchCount").type("0");

    cy.contains("lukumäärä ei voi olla 0")
    cy.get("#selectCatchCount").clear();
    cy.get("#selectCatchCount").type("-3");
    cy.contains("Negatiiviset arvot");
    cy.get("#selectCatchCount").clear();
    cy.get("#selectCatchCount").type("2");
    cy.should("not.contain", "Negatiiviset arvot");
    cy.should("not.contain", "lukumäärä ei voi olla 0");
    cy.get("#opened").clear();
    cy.get("#opened").type(wrongOpened);
    cy.contains("suljetuksi ennen avausaikaa");
    cy.get("#opened").clear();
    cy.get("#opened").type(opened);
    cy.should("not.contain", "suljetuksi ennen avausaikaa");

    cy.get("#netCodes").type(netCodes);
    cy.get("#saveButton").should("not.be.disabled");

  });


});
