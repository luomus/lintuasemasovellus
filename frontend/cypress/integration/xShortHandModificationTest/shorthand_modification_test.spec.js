import { myBeforeEach } from "../methods.js";


const date = "02.01.2020";
const observer = "Aarni Apulaishavainnoitsija";
const comment = "Olipa tyhmä sää.";
const shorthand = "10:00\nsommol 1/2 W\n12:00";


describe("ShorthandModification", function() {
    
    beforeEach(function() {
      myBeforeEach();
    });


    it("An observation and observation day can be saved on firstpage for Vakio", function() {

      cy.get("#date-picker-inline").clear();
      cy.get("#date-picker-inline").type(date);
      cy.get ("#observers").clear();
      cy.get ("#comment").clear();
      cy.wait(1000);
      cy.get ("#observers").type(observer);
      cy.get("#comment").type(comment);
      cy.get("#selectType").click().get("#Vakio").click();
      cy.get("#selectLocation").click().get("#Bunkkeri").click();
      cy.get(".CodeMirror textarea").type(shorthand, { force: true });
      cy.wait(1000);
      cy.contains("Tallenna").click({ force: true });
      cy.wait(1000);
      cy.contains(date);
  
    });

    it("Xxxxxxxx", function () {
      cy.contains(date).click();
      cy.contains('Muokkaa').click();
        
    });
});