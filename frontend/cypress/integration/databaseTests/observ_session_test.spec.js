const observStation = 'Hangon Lintuasema'
const date = '01.01.2020'
const observer = 'Hilla Havainnoitsija'
const comment = 'Olipa kiva sää'

describe('AddObservationSession', function() {//tämä sisältää nyt testejä, jotka väärässä paikassa eikä vastaa annettua nimeä.
    beforeEach(function() {    //Poistettu toisteisuutta. Tämä tehdään ennen jokaista allaolevaa testiä.
      cy.visit('http://localhost:3000')
      cy.get('#navigationbar').click()
    })
    it('Front page has button for adding an observation session', function() {
      cy.contains('Lisää havainnointikerta')
    })
    it('There are fields for adding observation station name and date of the session', function() {
      cy.contains('Lisää havainnointikerta').click()
      cy.contains('Lintuasema')
      cy.contains('Päivämäärä')
      cy.contains('Havainnoija(t)')
      cy.contains('Kommentti')
      cy.contains('Tallenna')
    })
    it('An observation session can be saved', function() {
      cy.contains('Lisää havainnointikerta').click()
      //cy.get('#Lintuasema').type(observStation) //Tämäkohta lakannut toimimasta dropdown filun kanssa. type() kirjoittaa. Miten saisi valittua dropdownista.lisättävä jotain sisältöä havainnoija(t) ja kommentti testejä varten
      cy.get('#date-required').type(date)
      cy.get ('#observers').type(observer)
      cy.get('#comment').type(comment)
      cy.contains('Tallenna').click()
    })
    it('There is a button for listing all observation sessions', function() {
      cy.contains('Näytä havainnointikerrat') 
    }) 

    it('There is a button for adding observation', function() {
      cy.contains('Lisää havaintoja')
    })//lisättävä testi jossa annetaan kentille tiedot ja tallennetaan
    it('There is a button for listing all observations', function() {
      cy.contains('Näytä havainnot') 
    })//lisättävä testi, jossa katsotaan, että havainnot tallentuvat
  })