const { default: TouchRipple } = require("@material-ui/core/ButtonBase/TouchRipple");

const observStation = "Hangon Lintuasema";
const date = "01.01.2020";
const observer = "Hilla Havainnoitsija";
const comment = "Olipa kiva sää.";
const date2 = "02.02.2020";
const observer2 = "Talle Testaaja";
const comment2 = "Koko päivän satoi räntää eikä nähnyt mitään.";
const date3 = "03.03.2020";
const observer3 = "Ano Nyymi";
const comment3 = "Tuntematon tunkeutuja lintuasemalla.";
describe("AddObservationDay", function() {//tämä sisältää nyt testejä, jotka väärässä paikassa eikä vastaa annettua nimeä.
  beforeEach(function() {    //Poistettu toisteisuutta. Tämä tehdään ennen jokaista allaolevaa testiä.
    cy.visit("http://localhost:3000");
    cy.visit("http://localhost:3000/testlogin?token=MzJkNTVkMjAtZTFjZS00NzEzLTlkM2MtMmRjZGI1ODYyNGUw");
    
    cy.get("#submit").click(); // placeholder
    cy.get("#navigationbar").click();
    
  });
  it("Front page has button for adding an observation day", function() {
    cy.contains("Lisää päivä");
  });
  it("There are fields for adding observation station name, date, observers, comment and a button Save for the day", function() {
    cy.contains("Lisää päivä").click();
    cy.contains("Lintuasema");
    cy.contains("Päivämäärä");
    cy.contains("Havainnoija(t)");
    cy.contains("Kommentti");
    cy.contains("Tallenna");
  });
  it("An observation day can be saved", function() {
    cy.contains("Lisää päivä").click();
    cy.get("#select").click().get("#HangonLintuasema").click({ force:true });//.get('#Hangon Lintuasema').contains().click();
    cy.get("#date-picker-inline").clear();
    cy.get("#date-picker-inline").type(date);
    cy.get ("#observers").type(observer);
    cy.get("#comment").type(comment);
    cy.contains("Tallenna").click();
  });
  it("There is a button for listing all observation day", function() {
    cy.contains("Näytä päivä");
  });
  it("The observation day saved can be found on page Näytä päivät", function(){
    cy.contains("Näytä päivät").click();
    cy.contains(date);
    cy.contains(observer);
    cy.contains(comment);
  });
  it("Multiple observation days can be saved", function() {
    cy.contains("Lisää päivä").click();
    cy.get("#select").click().get("#HangonLintuasema").click({ force:true });//.get('#Hangon Lintuasema').contains().click();
    cy.get("#date-picker-inline").clear();
    cy.get("#date-picker-inline").type(date2);
    cy.get ("#observers").type(observer2);
    cy.get("#comment").type(comment2);
    cy.contains("Tallenna").click();
  });
  it("All added days can be found on page Näytä päivät", function() {
    cy.contains("Näytä päivät").click();
    cy.contains(date);
    cy.contains(observer);
    cy.contains(comment);
    cy.contains(date2);
    cy.contains(observer2);
    cy.contains(comment2);
  });
  it("Observation day with same observatory and date can only be added once", function() {
    cy.contains("Lisää päivä").click();
    cy.get("#select").click().get("#HangonLintuasema").click({ force:true });//.get('#Hangon Lintuasema').contains().click();
    cy.get("#date-picker-inline").clear();
    cy.get("#date-picker-inline").type(date);
    cy.get ("#observers").type(observer);
    cy.get("#comment").type("Tämä on duplikaatti");
    cy.contains("Tallenna").click();
    cy.visit("http://localhost:3000");
    
    cy.get("#submit").click(); // placeholder
    cy.get("#navigationbar").click();
    cy.contains("Näytä päivät").click();
    cy.contains(date);
    cy.contains(observer);
    cy.get("Tämä on duplikaatti").should("not.exist");
  });
  it("Observation day can not be added if user is not logged in", function() {
    cy.visit("http://localhost:3000/logout");
    cy.visit("http://localhost:3000");
    
    cy.get("#submit").dblclick(); // placeholder
    cy.get("#navigationbar").click();
    cy.contains("Lisää päivä").click();
    cy.get("#select").click().get("#HangonLintuasema").click({ force:true });//.get('#Hangon Lintuasema').contains().click();
    cy.get("#date-picker-inline").clear();
    cy.get("#date-picker-inline").type(date3);
    cy.get ("#observers").type(observer3);
    cy.get("#comment").type(comment3);
    cy.contains("Tallenna").click();
    cy.contains("Lomakkeen lähetyksessä ongelmia");
  })
});

