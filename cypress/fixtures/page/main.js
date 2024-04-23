import { STARTING_POSITION, move } from '../../../src/position.js';
import {
    clearPieces,
    createBoard,
    getSquare,
    renderGameInfo,
    renderPieces,
    selectGame,
} from '../../../src/ui.js';

let position = STARTING_POSITION;

try {
    createBoard();
    renderPieces(position);
} catch (e) {
    console.error(e);
}

window.chess = {
    getPosition: () => position,
    move: (m) => {
        position = move(m, position);

        try {
            clearPieces();
            renderPieces(position);
        } catch (e) {
            console.error(e);
        }

        return position;
    },
    displayPosition: (p) => {
        if (p) position = p;

        try {
            clearPieces();
            renderPieces(position);
        } catch (e) {
            console.error(e);
        }

        return position;
    },
    renderGameInfo: (game) => renderGameInfo(game),
    showDialog: () => {
        /** @type {HTMLDialogElement} */
        const dialog = document.querySelector('#select-game-dialog');
        dialog.showModal();
    },
    selectGame,
    getSquare,
    clearPieces,
};
