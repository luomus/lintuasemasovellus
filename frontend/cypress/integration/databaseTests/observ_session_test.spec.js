const observStation = 'Hangon lintuasema'
const date = '01.01.2020'

describe('AddObservationSession', function() {
    it('Front page has button for adding an observation session', function() {
      cy.visit('http://localhost:3000')
      cy.contains('Lisää havainnointikerta')
    })
    it('There are fields for adding observation station name and date of the session', function() {
      cy.visit('http://localhost:3000')
      cy.contains('Lisää havainnointikerta').click()
      cy.contains('Lintuasema')
      cy.contains('Päivämäärä')
    })
    it('An observation session can be saved', function() {
      cy.visit('http://localhost:3000')
      cy.contains('Lisää havainnointikerta').click()
      cy.get('input:first').type(observStation)
      cy.get('input:last').type(date)
      //cy.contains('Tallenna').click()
    })
    it('There is a button for listing all observation sessions', function() {
      cy.visit('http://localhost:3000')
      cy.contains('Näytä havainnointikerrat') //muutettu Annun toimesta
    })
  })