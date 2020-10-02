// const observStation = "Hangon Lintuasema";
const date = "01.01.2020";
const observer = "Hilla Havainnoitsija";
const comment = "Olipa kiva sää";

describe("AddObservationDay", function() {//tämä sisältää nyt testejä, jotka väärässä paikassa eikä vastaa annettua nimeä.
  beforeEach(function() {    //Poistettu toisteisuutta. Tämä tehdään ennen jokaista allaolevaa testiä.
    cy.visit("http://localhost:3000");
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
    cy.get("#select").click().get("#testStation").click();
    cy.get("#date-required").type(date);
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
});

//Muokkasin nyt tuota lomake lähetetty -ilmoitusta ja sen pitäisi nyt toimia järkevämmin, ainakin toivottavasti.
// Muutin myös validointia niin, että lintuasemaa, päivämäärää ja havainnoijakenttää ei voi jättää tyhjäksi.
//Kommentti taisi olla vapaaehtoinen kenttä(?) niin tuon pitäisi hyväksyä uudet päivät myös ilman sitä.