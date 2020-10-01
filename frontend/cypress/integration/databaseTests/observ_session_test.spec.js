const observStation = 'Hangon lintuasema'
const date = '01.01.2020'

describe('AddObservationSession', function() {
    it('Front page has button for adding an observation session', function() {
      cy.visit('http://localhost:3000')
      cy.get('#navigationbar').click()
      cy.contains('Lisää havainnointikerta')
    })
    it('There are fields for adding observation station name and date of the session', function() {
      cy.visit('http://localhost:3000')
      cy.get('#navigationbar').click()
      cy.contains('Lisää havainnointikerta').click()
      cy.contains('Lintuasema')
      cy.contains('Päivämäärä')
      cy.contains('Havainnoija(t)')
      cy.contains('Kommentti')
      cy.contains('Tallenna')
    })
    it('An observation session can be saved', function() {
      cy.visit('http://localhost:3000')
      cy.get('#navigationbar').click()
      cy.contains('Lisää havainnointikerta').click()
      cy.get('input:first').type(observStation) //lisättävä jotain sisältöä havainnoija(t) ja kommentti testejä varten
      cy.get('input:last').type(date)
      //cy.contains('Tallenna').click()
    })
    it('There is a button for listing all observation sessions', function() {
      cy.visit('http://localhost:3000')
      cy.get('#navigationbar').click()
      cy.contains('Näytä havainnointikerrat') 
    }) 
    it('There is a button for adding observation', function() {
      cy.visit('http://localhost:3000')
      cy.get('#navigationbar').click()
      cy.contains('Lisää havaintoja')
    })//lisättävä testi jossa annetaan kentille tiedot ja tallennetaan
    it('There is a button for listing all observations', function() {
      cy.visit('http://localhost:3000')
      cy.get('#navigationbar').click()
      cy.contains('Näytä havainnot') 
    })//lisättävä testi, jossa katsotaan, että havainnot tallentuvat
  })