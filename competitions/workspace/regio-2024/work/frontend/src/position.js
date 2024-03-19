/**
 * Regional Championship 2024 - Skill 17 - Web Technologies
 * Frontend
 *
 * Your task is to implement all methods marked with @todo.
 * You are allowed to add additional methods and variables to this file if you need to.
 * You are not allowed to change the signature of or delete existing methods.
 */

import {
    Bishop,
    King,
    Knight,
    Pawn,
    Queen,
    Rook,
    canBishopMove,
    canKingMove,
    canKnightMove,
    canPawnMove,
    canQueenMove,
    canRookMove,
} from './pieces.js';

export const STARTING_POSITION = [
    new Rook('a1', 'w'),
    new Knight('b1', 'w'),
    new Bishop('c1', 'w'),
    new Queen('d1', 'w'),
    new King('e1', 'w'),
    new Bishop('f1', 'w'),
    new Knight('g1', 'w'),
    new Rook('h1', 'w'),
    new Pawn('a2', 'w'),
    new Pawn('b2', 'w'),
    new Pawn('c2', 'w'),
    new Pawn('d2', 'w'),
    new Pawn('e2', 'w'),
    new Pawn('f2', 'w'),
    new Pawn('g2', 'w'),
    new Pawn('h2', 'w'),
    new Rook('a8', 'b'),
    new Knight('b8', 'b'),
    new Bishop('c8', 'b'),
    new Queen('d8', 'b'),
    new King('e8', 'b'),
    new Bishop('f8', 'b'),
    new Knight('g8', 'b'),
    new Rook('h8', 'b'),
    new Pawn('a7', 'b'),
    new Pawn('b7', 'b'),
    new Pawn('c7', 'b'),
    new Pawn('d7', 'b'),
    new Pawn('e7', 'b'),
    new Pawn('f7', 'b'),
    new Pawn('g7', 'b'),
    new Pawn('h7', 'b'),
];

/**
 * Moves a piece to a new position.
 * May capture a piece on the target square.
 * Returns the new position after the move.
 * Is immutable and does not alter the original position.
 *
 * @param {import('./pieces.js').Piece} piece
 * @param {import('./util.js').Square} square
 * @param {import('./pieces.js').Piece[]} position
 * @returns {import('./pieces.js').Piece[]}
 */
export function movePiece(piece, square, position) {
    // @todo
    piece.square = square;
    position.map((pos) => {
        
    });
}

/**
 * Determines if the move is executed with the provided piece.
 * @param {import('./pieces.js').Piece} piece
 * @param {import('./util.js').Move} move
 * @param {import('./pieces.js').Piece[]} position
 * @returns boolean
 */
export function canPieceMove(piece, move, position) {
    // has the correct color
    if (move.color !== piece.color) return false;

    // has the correct piece notation
    if (move.piece !== piece.notation) return false;

    // is on the correct file or rank
    if (move.fileIdentifier || move.rankIdentifier) {
        const square = `${move.fileIdentifier ?? piece.square[0]}${
            move.rankIdentifier ?? piece.square[1]
        }`;
        if (piece.square !== square) return false;
    }

    // check specifics of the correct type of piece
    switch (move.piece) {
        case 'K':
            return canKingMove(move, piece, position);
        case 'Q':
            return canQueenMove(move, piece, position);
        case 'R':
            return canRookMove(move, piece, position);
        case 'N':
            return canKnightMove(move, piece, position);
        case 'B':
            return canBishopMove(move, piece, position);
        case 'P':
            return canPawnMove(move, piece, position);
    }

    // wasn't able to check a specific piece type
    // this should not happen
    throw new Error('Invalid: condition for move.piece should have been met');
}

/**
 * Executes a castling move with the current position. Returns the new position after the move.
 * @param {import('./util.js').Move} move
 * @param {import('./pieces.js').Piece[]} position
 * @returns {import('./pieces.js').Piece[]}
 */
export function doCastleMove(move, position) {
    // get the king
    const king = position.find(
        (p) => p.color === move.color && p.notation === 'K'
    );

    if (move.castle === 'short') {
        // get the rook on the h-file
        const rook = position.find(
            (p) =>
                p.color === move.color &&
                p.notation === 'R' &&
                p.square[0] === 'h'
        );

        // move pieces to their respective new squares
        position = movePiece(king, `g${king.square[1]}`, position);
        position = movePiece(rook, `f${king.square[1]}`, position);
        return position;
    } else if (move.castle === 'long') {
        // get the rook on the a-file
        const rook = position.find(
            (p) =>
                p.color === move.color &&
                p.notation === 'R' &&
                p.square[0] === 'a'
        );

        // move pieces to their respective new squares
        position = movePiece(king, `c${king.square[1]}`, position);
        position = movePiece(rook, `d${king.square[1]}`, position);
        return position;
    }
}

/**
 * Executes one chess move with the current position. Returns the new position after the move.
 * @param {import('./util.js').Move} move
 * @param {import('./pieces.js').Piece[]} position
 * @returns {import('./pieces.js').Piece[]}
 */
export function move(move, position) {
    // execute a castling move
    if (move.castle) return doCastleMove(move, position);

    // if it is not a castling move, it must be a standard move
    // find the piece that the move was played with
    let [piece, ...rest] = position.filter((p) =>
        canPieceMove(p, move, position)
    );

    // a piece that can do this move must have been found
    if (!piece) throw new Error('Invalid: no piece to move with was found');

    // only one piece could have executed the move!
    // if there were multiple found - you will have to narrow your selection
    if (rest.length > 0) throw new Error('Invalid: multiple pieces were found');

    // execute the move with the correct piece
    return movePiece(piece, move.targetSquare, position);
}
