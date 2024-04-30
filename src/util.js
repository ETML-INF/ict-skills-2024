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

class Move {
    constructor(num, color, piece, fileIdentifier, rankIdentifier, targetSquare, capture, check, checkmate, castle) {
        this.num = num;
        this.color = color; 
        this.piece = piece; 
        this.fileIdentifier = fileIdentifier;
        this.rankIdentifier = rankIdentifier; 
        this.capture = capture;
        this.targetSquare = targetSquare; 
        this.check = check;
        this.checkmate = checkmate; 
        this.castle = castle;
    }
}

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

class Game {
    constructor (white, black, result, date, moves) {
        this.white = white;
        this.black = black;
        this.result = result;
        this.date = date;
        this.moves = moves;
    }
}

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
 * Parse the SAN (Standard Algebraic Notation) of a move and return it as the object of type `Move`.
 * @param {number} num
 * @param {Color} color
 * @param {string} move <- SAN
 * @returns {Move}
 */
export function getMoveData(num, color, move) {
    let piece = (move[0] == move[0].toUpperCase()) ? move[0] : "P";
    let targetSquare = (move.length == 2) ? move : (move.length == 3) ? move.substring(1) : (move.length == 4) ? move.substring(2) : move.substring(3);
    let isCheck = move.includes('+')
    let isCheckmate = move.includes('#')
    let isCapture = move.includes('x')
    let castle = (move.includes('O-O-O') ? "long" : move.includes('O-O') ? "short" : undefined);
    let m = (move.length > 2) ? move.substring(1) : "";
    m = (m.length == 3) ? m[0] : (m.length == 4) ? m.substring(0, 2) : undefined;
    let file = (m != undefined) ? (['1', '2', '3', '4', '5', '6', '7', '8'].includes(m[0])) ? undefined : m[0] : undefined;
    let rank = (m != undefined) ? (m.length == 2) ? m[1] : undefined : undefined;
    rank = (rank != undefined && ['1', '2', '3', '4', '5', '6', '7', '8'].includes(rank)) ? parseInt(rank) : undefined;
    rank = (file == undefined && m != undefined) ? (m.length == 1) ? parseInt(m[0]) : undefined : rank;
    file = (move.includes('x') || move.includes('+') || move.includes('#')) ? (move[0] == move[0].toUpperCase()) ? undefined : move[0] : file;
    targetSquare = (move.includes('x')) ? move.substring(2) : targetSquare;
    targetSquare = (move.includes('+')) ? (move.length == 4) ? move.substring(1, 3) : move.substring(2, 4) : targetSquare;
    targetSquare = (move.includes('#')) ? move.substring(2, 4) : targetSquare;
    return new Move(num, color, piece, file, rank, targetSquare, isCapture, isCheck, isCheckmate, castle)
}

/**
 * Parse a PGN-string and return it as an object of type `Game`.
 * @param {string} pgn
 * @returns {Game}
 */
export function readGameFromPGN(pgn) {
    let white = pgn.split("White")[1].split("]")[0];
    white = white.substring(2, white.length - 1);

    let black = pgn.split("Black")[1].split("]")[0];
    black = black.substring(2, black.length - 1);

    let result = pgn.split("Result")[1].split("]")[0];
    result = result.substring(2, result.length - 1);

    let date = pgn.split("Date")[1].split("]")[0];
    date = date.substring(2, date.length - 1);
    var validDate = new Date(date);

    let moves = getMoveData();

    var game = new Game(white, black, result, validDate, moves);

    return game;
}