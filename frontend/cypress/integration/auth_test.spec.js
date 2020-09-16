describe('LoginButton', function() {
  it('front page has login button', function() {
    cy.visit('http://localhost:3000')
    cy.contains('Kirjaudu')
  })
})
