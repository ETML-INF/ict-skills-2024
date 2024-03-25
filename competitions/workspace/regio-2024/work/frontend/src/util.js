/**
 * Regional Championship 2024 - Skill 17 - Web Technologies
 * Frontend
 *
 * Your task is to implement all methods marked with @todo.
 * You are allowed to add additional methods and variables to this file if you need to.
 * You are not allowed to change the signature of or delete existing methods.
 */

/**
 * @typedef {'b' | 'w'} Color
 */

/**
 * @typedef {'K' | 'Q' | 'R' | 'B' | 'N' | 'P'} PieceNotation
 */

/**
 * @typedef {'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' |'h'} File
 */

/**
 * @typedef {1 | 2 | 3 | 4 | 5 | 6 | 7 | 8} Rank
 */

/**
 * @typedef {`${File}${Rank}`} Square
 */

/**
 * @typedef {{
 *  num: number,
 *  color: Color,
 *  piece?: PieceNotation,
 *  fileIdentifier?: File,
 *  rankIdentifier?: Rank,
 *  capture: boolean,
 *  targetSquare?: Square,
 *  check: boolean,
 *  checkmate: boolean,
 *  castle?: 'short' | 'long'
 * }} Move
 */

/**
 * A chess game read from a Portable Game Notation (PGN)
 * @typedef {{
 *  white: string,
 *  black: string,
 *  result: string,
 *  date: Date,
 *  moves: Move[]
 * }} Game
 */

/**
 * Parse the SAN (Standard Algebraic Notation) of a move and return it as the object of type `Move`.
 * @param {number} num
 * @param {Color} color
 * @param {string} move <- SAN
 * @returns {Move}
 */
export function getMoveData(num, color, move) {
    // @todo
}

/**
 * Parse a PGN-string and return it as an object of type `Game`.
 * @param {string} pgn
 * @returns {Game}
 */
export function readGameFromPGN(pgn) {
    // @todo
}
