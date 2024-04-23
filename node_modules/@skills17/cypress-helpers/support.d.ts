/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Get the width of an element
     */
    width(): Chainable<number>;

    /**
     * Get the height of an element
     */
    height(): Chainable<number>;

    /**
     * Get the top position of an element
     */
    top(): Chainable<number>;

    /**
     * Get the left position of an element
     */
    left(): Chainable<number>;

    /**
     * Get the bottom position of an element
     */
    bottom(): Chainable<number>;

    /**
     * Get the right position of an element
     */
    right(): Chainable<number>;
  }
}
