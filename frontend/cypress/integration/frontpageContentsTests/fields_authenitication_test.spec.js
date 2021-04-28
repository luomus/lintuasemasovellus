import { myBeforeEach } from "../methods.js";

const date = "01.01.2020";
const observer = "Hilla Havainnoitsija";
const comment = "Olipa kiva sää.";
const shorthand = "10:00\nsommol 1/2 W\n12:00";
const opened = "06:00";
const wrongOpened = "07:30";
const closed = "07:00";
const closed2 = "07:30";
const netCodes = "abcde";

describe("FieldsAndAuthenticationTest", function () {
  beforeEach(function () {
    myBeforeEach();
  });

  it("Newly opened page doesn't have errors", function () {
    cy.get("#activity-header").click();
    cy.get("#catches-header").click();
    cy.get("#plus-catch-row-button").click();
    cy.get("#comment-header").click();

    cy.should("not.contain", "Negatiiviset arvot");
    cy.should("not.contain", "lukumäärä ei voi olla 0");
    cy.should("not.contain", "suljetuksi ennen avausaikaa");
    cy.should("not.contain", "pituus on yleensä 9-12 metriä");
    cy.should("not.contain", "määrä on huomattavan suuri");
    cy.should("not.contain", "Olet ilmoittamassa poikkeuksellisen ison määrän liitteitä");

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
    cy.get("#comment-header").contains("Kommentteja kirjattu");
    cy.get("[name=standardObs]").click();
    cy.get("#attachments").type("1");
    cy.get("#selectType").click().get("#Vakio").click();
    cy.get("#selectLocation").click().get("#Bunkkeri").click();
    cy.get(".CodeMirror textarea").type(shorthand, { force: true });

    cy.get("#catches-header").click();
    cy.get("#saveButton").should("not.be.disabled");
    cy.get("#plus-catch-row-button").click();
    cy.get("#selectCatchType").click();
    cy.contains("Vakioverkko").click();
    cy.get("#saveButton").should("be.disabled");
    cy.get("#0 #removeButton").click();
    cy.get("#saveButton").should("not.be.disabled");
    cy.get("#plus-catch-row-button").click();
    cy.get("#selectCatchType").click();
    cy.contains("Vakioverkko").click();
    cy.get("#saveButton").should("be.disabled");
    cy.get("#0 #removeButton").click();
    cy.get("#saveButton").should("not.be.disabled");

    cy.get("#plus-catch-row-button").click();
    cy.get("#selectCatchType").click();
    cy.contains("Vakioverkko").click();
    cy.get("#saveButton").should("be.disabled");
    cy.get("#selectCatchArea").click();
    cy.get(".MuiList-root").contains("Vakioverkot K").click();
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
    cy.get("#selectCatchCount").type("1");
    cy.get("#saveButton").should("not.be.disabled");
    cy.get("#opened").clear();
    cy.get("#opened").type(wrongOpened);
    cy.get("#saveButton").should("be.disabled");
    cy.get("#opened").clear();
    cy.get("#opened").type(opened);

    //duplicate catch row
    cy.get("#plus-catch-row-button").click();
    cy.get("#1 #selectCatchType").click();
    cy.get(".MuiList-root").contains("Vakioverkko").click();
    cy.get("#1 #selectCatchArea").click();
    cy.get(".MuiList-root").contains("Vakioverkot K").click();
    cy.get("#1 #opened").clear();
    cy.get("#1 #opened").type(opened);
    cy.get("#1 #closed").clear();
    cy.get("#1 #closed").type(closed);
    cy.get("#saveButton").should("be.disabled");
    cy.get("#1 #closed").type(closed2);
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
    cy.get("#attachments").type("-1");
    cy.contains("Negatiiviset arvot eivät ole sallittuja!");
    cy.get("#attachments").clear();
    cy.contains("Kenttä ei saa olla tyhjä");
    cy.get("#attachments").type("0");
    cy.contains("Gåulla käynti").click();
    cy.get("#activity-header").contains("Havaintoaktiivisuus kirjattu");
    cy.contains("Gåulla käynti").click();
    cy.get("#activity-header").contains("Ei havaintoaktiivisuusmerkintöjä");
    cy.get("#attachments").type("1");
    cy.get("#activity-header").contains("Havaintoaktiivisuus kirjattu");
    cy.get("#selectType").click().get("#Vakio").click();
    cy.get("#selectLocation").click().get("#Bunkkeri").click();
    cy.get(".CodeMirror textarea").type(shorthand, { force: true });
    cy.get("#catches-header").click();
    cy.get("#saveButton").should("not.be.disabled");
    cy.get("#plus-catch-row-button").click();
    cy.get("#selectCatchType").click();
    cy.contains("Petoverkot").click();
    cy.get("#saveButton").should("be.disabled");
    cy.get("#selectCatchArea").click();
    cy.contains("Muut petoverkot").click();
    cy.get("#opened").clear();
    cy.get("#opened").type(opened);
    cy.get("#closed").clear();
    cy.get("#closed").type(closed);
    cy.get("#saveButton").should("not.be.disabled");
    cy.get("#selectCatchCount").clear();
    cy.get("#selectCatchCount").type("0");

    cy.contains("lukumäärä ei voi olla 0");
    cy.get("#selectCatchCount").clear();
    cy.get("#selectCatchCount").type("-3");
    cy.contains("Negatiiviset arvot");
    cy.get("#selectCatchCount").clear();
    cy.get("#selectCatchCount").type("2");
    cy.should("not.contain", "Negatiiviset arvot");
    cy.should("not.contain", "lukumäärä ei voi olla 0");
    cy.get("#catches-header").contains("Pyydystietoja kirjattu");
    cy.get("#opened").clear();
    cy.get("#opened").type(wrongOpened);
    cy.contains("suljetuksi ennen avausaikaa");
    cy.get("#opened").clear();
    cy.get("#opened").type(opened);
    cy.should("not.contain", "suljetuksi ennen avausaikaa");

    cy.get("#netCodes").type(netCodes);
    cy.get("#saveButton").should("not.be.disabled");

    //duplicate catch row
    cy.get("#plus-catch-row-button").click();
    cy.get("#1 #selectCatchType").click();
    cy.get(".MuiList-root").contains("Petoverkot").click();
    cy.get("#1 #selectCatchArea").click();
    cy.get(".MuiList-root").contains("Muut petoverkot").click();
    cy.get("#1 #opened").clear();
    cy.get("#1 #opened").type(opened);
    cy.get("#1 #closed").clear();
    cy.get("#1 #closed").type(closed);
    cy.contains("Pyyntialueella 'Muut petoverkot' on ilmoitettu samanlainen pyydys useampaan kertaan");
    cy.get("#1 #closed").type(closed2);
    cy.should("not.contain", "Pyyntialueella 'Muut petoverkot' on ilmoitettu samanlainen pyydys useampaan kertaan");

  });

  it("Further error messaging is correct", function () {
    cy.get("#date-picker-inline").clear();
    cy.get("#date-picker-inline").type(date);
    cy.get("#observers").clear();
    cy.get("#activity-header").click();
    cy.contains("Rengastusvakio").click();
    cy.get("#activity-header").contains("Havaintoaktiivisuus kirjattu");
    cy.get("#catches-header").contains("Virheitä pyydyksissä");
    cy.get("#catches-header").click();
    cy.contains("Lisää ainakin yksi vakioverkko.");
    cy.get("#plus-catch-row-button").click();
    cy.get("#selectCatchType").click();
    cy.contains("Vakioverkko").click();
    cy.get("#saveButton").should("be.disabled");
    cy.get("#selectCatchArea").click();
    cy.contains("Vakioverkot K").click();
    cy.should("not.contain", "Lisää ainakin yksi vakioverkko.");

    // cy.get("#plus-catch-row-button").click();
    // cy.get("#1 #selectCatchType").click();
    // cy.contains("Vakioverkko").click({ force: true });
    // cy.get("#1 #selectCatchArea").click();
    // cy.contains("Vakioverkot K").click({ force: true });
    // cy.contains("on ilmoitettu useampaan kertaan");
    // cy.get("#0 #removeButton").click();
    // cy.should("not.contain", "on ilmoitettu useampaan kertaan");

    //cy.get("#selectCatchCount").clear();
    cy.get("#selectCatchCount").type("2");
    cy.contains("Pyydyksen 'Vakioverkot K' lukumäärä voi olla korkeintaan 1.");
    cy.get("#saveButton").should("be.disabled");

  });


});
