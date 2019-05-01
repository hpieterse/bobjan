/// <reference types="Cypress" />
import { translate, rotate } from 'transformation-matrix'
import { transformToString } from '../support/transform'

context('Window', () => {
  const quarterNoteMs = 250;

  beforeEach(() => {
    cy.visit('')
    cy.viewport(700, 620);// means slope is 450 x 450
  })

  it('check window title', () => {
    cy.title().should('include', 'Bobjan');
  })

  it('should have baboon image', () => {
    cy.get('.baboon').find('div').should(($el) => {
      if (window.devicePixelRatio == 1) {
        expect($el).to.have.css('background-image', `url("http://localhost:4200/assets/baboon.png")`);
      } else {
        expect($el).to.have.css('background-image', `url("http://localhost:4200/assets/baboon@${window.devicePixelRatio}x.png")`);
      }
    });

  });

  it('should have baboon at start position', () => {
    cy.wait(quarterNoteMs);
    cy.get('.baboon').find('div').should(($el) => {
      expect($el).to.include.css('transform', 'matrix(1, 0, 0, 1, -85, 0)');
    });
  });

  it('should test whole animation', () => {
    cy.wait(quarterNoteMs);
    cy.get('.game-board').click();
    cy.wait(quarterNoteMs);
    cy.wait(quarterNoteMs);

    cy.get('.baboon').find('div').should(($el) => {
      expect($el).to.include.css('transform',
        transformToString(
          translate(22, -22),
          rotate(-Math.PI / 4)
        ));
    });

  });
})
