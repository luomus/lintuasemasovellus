const { default: TouchRipple } = require("@material-ui/core/ButtonBase/TouchRipple");


const observStation = "Hangon Lintuasema";
const date = "01.01.2020";
const observer = "Hilla Havainnoitsija";
const comment = "Olipa kiva sää";
const startTime = "07:00";
const endTime = "07:30";
const type = "Vakio";

describe("AddObservationPeriod", function() {
  beforeEach(function() {
    cy.visit("http://localhost:3000");
    cy.get("#observatory-dialog").click(); // placeholder
    cy.get("#submit").click({force: true}); // placeholder
    cy.visit("http://localhost:3000/testlogin?token=MzJkNTVkMjAtZTFjZS00NzEzLTlkM2MtMmRjZGI1ODYyNGUw");
    cy.get("#observatory-dialog").click(); // placeholder
    cy.get("#submit").click({force: true}); // placeholder
    cy.get("#navigationbar").click();

    //saving a day and clicking it:
    cy.contains("Lisää päivä").click();
    cy.get("#select").click().get("#HangonLintuasema").click({ force:true });
    cy.get("#date-picker-inline").clear();
    cy.get("#date-picker-inline").type(date);
    cy.get ("#observers").type(observer);
    cy.get("#comment").type(comment);
    cy.contains("Tallenna").click();

    cy.get("#navigationbar").click();
    cy.contains("Näytä päivät").click();
    cy.contains(date).click();

  });

  it("The observation day view contains the saved date and observatory", function(){
    cy.contains(date);
    cy.contains(observStation);
    cy.contains("Sijainti");
    cy.contains("Tyyppi");
  });


  it("An observation period can be saved", function() {
    cy.get("#location").click();
    cy.get("ul > li").eq(0).click(); //en keksinyt mitään muuta tapaa valita bunkkeria..
    cy.get("#startTime").clear();
    cy.get("#startTime").type(startTime);
    cy.get("#endTime").clear();
    cy.get("#endTime").type(endTime);
    cy.get("#type").type(type);
    cy.contains("Tallenna").click();

    cy.contains("Bunkkeri");
    cy.contains(startTime);
    cy.contains(endTime);
    cy.contains(type);
  });
});