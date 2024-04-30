/**
 * Regional Championship 2024 - Skill 17 - Web Technologies
 * Frontend
 *
 * Your task is to implement all methods marked with @todo.
 * You are allowed to add additional methods and variables to this file if you need to.
 * You are not allowed to change the signature of or delete existing methods.
 */

/**
 * Create a tr > td structure inside the table (ID "board") resembling the 64 squares of a chess board.
 */
export function createBoard() {
    // @todo
}

/**
 * Get the td-Element at the square coordinate provided.
 * @param {import("./util").Square} square
 */
export function getSquare(square) {
    // @todo
}

/**
 * Sets the background image of each cell with their piece. The background images are located in `lib/pieces`.
 * @param {import("./pieces.js").Piece[]} position
 */
export function renderPieces(position) {
    // @todo
}

/**
 * Clear the whole board of its pieces, removing the background images of all squares.
 */
export function clearPieces() {
    // @todo
}

/**
 * Show the names of white and black players and the result of the game at their corresponding spot in the DOM.
 * In the <header> element you will find spans with ID's #white, #black and #result.
 * The parameter `game` contains the infos from the PGN.
 *
 * @param {import("./util").Game} game
 */
export function renderGameInfo(game) {
    // @todo
}

/**
 * Create a promise that resolves to the PGN-string of the game.
 *
 * 1. user must upload a file - via the input type="file" at ID #game-input
 * 2. file must be read - hint: https://developer.mozilla.org/en-US/docs/Web/API/FileReader
 * 3. dialog must be closed - hint: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog
 * 4. promise must be resolved with the files content (PGN-string)
 *
 * @returns {Promise<string>} Portable Game Notation (PGN)
 */
export function selectGame() {
    // PAS FINI
    console.log(game-imput)
    return(readGameFromPGN(game-input));

}
