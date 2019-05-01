/// <reference types="Cypress" />
import { translate, rotate } from 'transformation-matrix'
import { transformToString } from '../support/transform'

context('Window', () => {
  const eightsNoteMs = Math.round((60 * 1000) / (132 * 2));

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
    cy.wait(eightsNoteMs);
    cy.get('.baboon').find('div').should(($el) => {
      expect($el).to.include.css('transform', 'matrix(1, 0, 0, 1, -85, 0)');
    });
  });

  it('should force landscape view', () => {
    cy.get('app-game-screen').should('have.class', 'landscape')
    cy.viewport(619, 620);
    cy.get('app-game-screen').should('have.class', 'portrait')
    cy.get('app-game-screen').should(($el) => {
      expect($el).to.include.css('transform', 
      transformToString(
        rotate(Math.PI / 2)
      ));
    });
  });

  it('should test whole animation', () => {
    const nextPosition = () => {
      cy.get('.game-board').click();
      cy.wait(eightsNoteMs);
      cy.wait(eightsNoteMs);
    };

    const waitForAudio = () => {
      cy.wait(eightsNoteMs * 6);
      cy.wait(100);// lag before playing audio
    }

    cy.wait(eightsNoteMs);
    nextPosition();

    // pos 1
    cy.get('.baboon').find('div').should(($el) => {
      expect($el).to.include.css('transform',
        transformToString(
          translate(22, -22),
          rotate(-Math.PI / 4)
        ));
    });
    waitForAudio();

    nextPosition();
    // pos 2
    cy.get('.baboon').find('div').should(($el) => {
      expect($el).to.include.css('transform',
        transformToString(
          translate(129, -129),
          rotate(-Math.PI / 4)
        ));
    });
    waitForAudio();

    nextPosition();
    // pos 3
    cy.get('.baboon').find('div').should(($el) => {
      expect($el).to.include.css('transform',
        transformToString(
          translate(236, -236),
          rotate(-Math.PI / 4)
        ));
    });
    waitForAudio();

    nextPosition();
    // pos 4
    cy.get('.baboon').find('div').should(($el) => {
      expect($el).to.include.css('transform',
        transformToString(
          translate(343, -343),
          rotate(-Math.PI / 4)
        ));
    });
    waitForAudio();

    nextPosition();
    // wait for top and end animation
    cy.wait(eightsNoteMs * 24);
    // back at bottom
    cy.get('.baboon').find('div').should(($el) => {
      expect($el).to.include.css('transform', 'matrix(1, 0, 0, 1, -85, 0)');
    });
  });
})
