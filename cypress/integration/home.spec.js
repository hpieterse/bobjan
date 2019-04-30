/// <reference types="Cypress" />

context('Window', () => {
  beforeEach(() => {
    cy.visit('')
  })

  it('check window title', () => {
    cy.title().should('include', 'Bobjan');
  })
})
