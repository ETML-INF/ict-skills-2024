import '@skills17/cypress-helpers/support';

Cypress.Commands.add('move', (move) => {
    cy.window({ log: false }).then((win) => {
        Cypress.log({
            name: 'move',
            message: JSON.stringify(move),
        });

        return win.chess.move(move);
    });
});

Cypress.Commands.add('logMove', (move) => {
    Cypress.log({
        name: 'move',
        message: JSON.stringify(move),
    });
});

Cypress.Commands.add('displayPosition', (p) =>
    cy.window().then((win) => {
        const position = win.chess.displayPosition(p);

        Cypress.log({
            name: 'position',
            message: JSON.stringify(position),
        });

        return position;
    }),
);

Cypress.Commands.add('renderGameInfo', (game) => {
    cy.window().then((win) => win.chess.renderGameInfo(game));
});

Cypress.Commands.add('showDialog', () => {
    cy.window().then((win) => win.chess.showDialog());
});
