/**
 * Regional Championship 2024 - Skill 17 - Web Technologies
 * Frontend
 *
 * Your task is to implement all methods marked with @todo.
 * You are allowed to add additional methods and variables to this file if you need to.
 * You are not allowed to change the signature of or delete existing methods.
 */

export class Piece {
    constructor(square, color, notation) {
        /** @type {import("./util").Square} */
        this.square = square;

        /** @type {import("./util").Color} */
        this.color = color;

        /** @type {import("./util").PieceNotation} */
        this.notation = notation;
    }
}

export class Pawn extends Piece {
    constructor(square, color) {
        super(square, color, 'P');
    }
}

export class Knight extends Piece {
    constructor(square, color) {
        super(square, color, 'N');
    }
}

export class Queen extends Piece {
    constructor(square, color) {
        super(square, color, 'Q');
    }
}

export class Rook extends Piece {
    constructor(square, color) {
        super(square, color, 'R');
    }
}

export class Bishop extends Piece {
    constructor(square, color) {
        super(square, color, 'B');
    }
}

export class King extends Piece {
    constructor(square, color) {
        super(square, color, 'K');
    }
}

/**
 * Determines if this king can execute this move.
 * @param {import("./util").Move} move
 * @param {King} piece
 * @param {Piece[]} position
 * @return boolean
 */
export function canKingMove(move, piece, position) {
    position.forEach((pos) => {
        if(pos.square == move.targetSquare) {
            if(pos.color == piece.color) {
                return false
            } else {
                return true
            }
        }
    })
}

/**
 * Determines if this queen can execute this move.
 * @param {import("./util").Move} move
 * @param {Queen} piece
 * @param {Piece[]} position
 * @return boolean
 */
export function canQueenMove(move, piece, position) {
    // @todo
}

/**
 * Determines if this rook can execute this move.
 * @param {import("./util").Move} move
 * @param {Rook} piece
 * @param {Piece[]} position
 * @return boolean
 */
export function canRookMove(move, piece, position) {
    // @todo
}

/**
 * Determines if this knight can execute this move.
 * @param {import("./util").Move} move
 * @param {Knight} piece
 * @param {Piece[]} position
 * @return boolean
 */
export function canKnightMove(move, piece, position) {
    // @todo
}

/**
 * Determines if this bishop can execute this move.
 * @param {import("./util").Move} move
 * @param {Bishop} piece
 * @param {Piece[]} position
 * @return boolean
 */
export function canBishopMove(move, piece, position) {
    // @todo
}

/**
 * Determines if this pawn can execute this move.
 * @param {import("./util").Move} move
 * @param {Pawn} piece
 * @param {Piece[]} position
 * @return boolean
 */
export function canPawnMove(move, piece, position) {
    position.forEach((pos) => {
        let square = pos.square;    
        let rank = parseInt(square[1])
        if(rank - parseInt(move.targetSquare[1]) == 1 || rank - parseInt(move.targetSquare[1]) == 2) {
            return true
        }
    });
    return false
}
