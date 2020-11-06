
// import { TouchRipple } from "@material-ui/core/ButtonBase/TouchRipple";
const observStation = "Hangon Lintuasema";
const date = "01.01.2020";
const observer = "Hilla Havainnoitsija";
const changedObserver= "Aarni Apulaishavainnoitsija";
const comment = "Olipa kiva sää.";
const changedComment= "hihihi asdfsommol";
const date2 = "02.02.2020";
const observer2 = "Talle Testaaja";
const comment2 = "Koko päivän satoi räntää eikä nähnyt mitään.";
const shorthand = "10:00\nsommol 1/2 W\n12:00";

//const date3 = "03.03.2020";
//const observer3 = "Ano Nyymi";
//const comment3 = "Tuntematon tunkeutuja lintuasemalla.";
describe("AddObservationDay", function() {//tämä sisältää nyt testejä, jotka väärässä paikassa eikä vastaa annettua nimeä.
  beforeEach(function() {    //Poistettu toisteisuutta. Tämä tehdään ennen jokaista allaolevaa testiä.
    cy.visit("http://localhost:3000");
    //cy.get("#login-link");
    //cy.contains("Kirjaudu");

    // Github actionsissa täytyy olla localhost:3000 (eli kun pushaat, valitse 3000)

    cy.visit("http://localhost:3000/testlogin?token=MzJkNTVkMjAtZTFjZS00NzEzLTlkM2MtMmRjZGI1ODYyNGUw");
    //cy.request("http://localhost:5000/testlogin?token=MzJkNTVkMjAtZTFjZS00NzEzLTlkM2MtMmRjZGI1ODYyNGUw");

    cy.visit("http://localhost:3000");


    const user = {
      id: "asdfsommol",
      fullName: "Asdf Sommol",
      emailAddress: "asdf@sommol.net"
    };

    cy.window()
      .its("store")
      .invoke("dispatch", {
        type: "SET_USER",
        data: {
          user
        },
      });


      

    cy.get("#select-observatory").click().get("ul > li").eq(0).click(); //valitsee listan ensimmäisen
    cy.get("#submit").contains("Tallenna").click();
    cy.contains("Valittu asema");

  });


  /* it("Front page has button for adding an observation day", function() {
    cy.get("#navigationbar").click();
    cy.contains("Lisää päivä").click({ force:true });
  }); */


  it("There are fields for adding observation station name, date, observers, comment and a button Save for the observation and day", function() {

    cy.contains("Lisää havaintoja");
    cy.contains("Päivämäärä");
    cy.contains("Havainnoija(t)");
    cy.contains("Kommentti");
    cy.contains("Tyyppi");
    cy.contains("Sijainti");
    cy.contains("Tallenna");
    cy.contains("Pikakirjoitus");
  });

  it("Observations station can be modified" , function() {
    cy.get("#observatorySelector").click();
    cy.get("#select-observatory").click().get("ul > li").eq(1).click();
    cy.get("#submit").contains("Tallenna").click();
    cy.contains("Jurmo");

  });



  it("An observation and observation day can be saved on firstpage", function() {

    cy.get("#date-picker-inline").clear();
    cy.get("#date-picker-inline").type(date);
    cy.get ("#observers").type(observer);
    cy.get("#comment").type(comment);
    cy.get("#selectType").click().get("#Vakio").click();
    cy.get("#selectLocation").click().get("#Bunkkeri").click();
    cy.get("#shorthand").type(shorthand);
    cy.contains("Tallenna").click({ force: true });
    cy.get("#sendCorrectObservation").click();
    

  });

  it("Day and period has been added", function() {
    cy.get("#navigationbar").click();
    cy.contains("Näytä päivät").click();
    cy.contains(observer);
    cy.contains(comment);
    cy.contains(observStation);
    cy.contains(date);

  });

  it("Observation can be opened to a new page", function() {
    cy.get("#navigationbar").click();
    cy.contains("Näytä päivät").click();
    cy.contains("Hilla Havainnoitsija").click();
    cy.contains("Bunkkeri");
    cy.contains("10:00");    
  });

  it("Comment can be edited", function() {
    cy.get("#navigationbar").click();
    cy.contains("Näytä päivät").click();
    cy.contains("Hilla Havainnoitsija").click();
    cy.get("#commentButton").click();
    cy.get("#commentField").clear();
    cy.get("#commentField").type(changedComment);
    cy.get("#commentSubmit").click();
    cy.contains(changedComment);
    cy.contains(comment).should('not.exist');  
    
    cy.get("#commentButton").click();
    cy.get("#commentField").clear();
    cy.get("#commentField").type(comment);
    cy.get("#commentSubmit").click();
  });

  it("Observer can be edited", function() {
    cy.get("#navigationbar").click();
    cy.contains("Näytä päivät").click();
    cy.contains("Hilla Havainnoitsija").click();
    cy.get("#observerButton").click();
    cy.get("#observerField").clear();
    cy.get("#observerField").type(changedObserver);
    cy.get("#observerSubmit").click(); 
    cy.contains(changedObserver);
    cy.contains(observer).should('not.exist');   
    
    
    cy.get("#observerButton").click();
    cy.get("#observerField").clear();
    cy.get("#observerField").type(observer);
    cy.get("#observerSubmit").click();
  });

  /*
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

    cy.get("#navigationbar").click();
    cy.contains("Näytä päivät").click();
    cy.contains(date);
    cy.contains(observer);
    cy.get("Tämä on duplikaatti").should("not.exist");
  });
  /* it("Observation day can not be added if user is not logged in", function() {
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
  }); */
});

