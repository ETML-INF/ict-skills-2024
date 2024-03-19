import { InvalidTileFormatError, TileOutOfBoundsError } from "../lib/errors.js";

/**
 * Validate a location.
 *
 * If the location has an incorrect format:
 * -> throw an `InvalidTileFormatError`
 *
 * If the location is out of bounds:
 * -> throw a `TileOutOfBoundsError`
 *
 * If the location is valid return `true`.
 *
 * @param {string} location the chess notation style location - eg. A1, B5, ...
 * @param {number} maxWidth the maximum size of the x-axis
 * @param {number} maxHeight the maximum size of the y-axis
 * @returns {boolean}
 */
export const validateLocation = (location, maxWidth, maxHeight) => {
  // TODO
};

/**
 * Convert a chess notation style location to x and y coordinates.
 * The x/y coordinates must start with 0 to be able to index arrays.
 * eg.:
 *
 * locationToCoordinates('A1') => {x: 0, y: 0}
 * locationToCoordinates('A2') => {x: 0, y: 1}
 * locationToCoordinates('B1') => {x: 1, y: 0}
 * locationToCoordinates('B2') => {x: 1, y: 1}
 *
 * @param {string} location the chess notation style location - eg. A1, B5, ...
 * @returns {{x: number, y: number}}
 */
export const locationToCoordinates = (location) => {
  switch (location) {
    case "A1":
      return { x: 0, y: 0 };
      break;
    case "A2":
      return { x: 0, y: 1 };
      break;
    case "A3":
      return { x: 0, y: 2 };
      break;
    case "A4":
      return { x: 0, y: 3 };
      break;
    case "A5":
      return { x: 0, y: 4 };
      break;
    case "A6":
      return { x: 0, y: 5 };
      break;
    case "A7":
      return { x: 0, y: 6 };
      break;
    case "A8":
      return { x: 0, y: 7 };
      break;
    case "A9":
      return { x: 0, y: 8 };
      break;
    case "A10":
      return { x: 0, y: 9 };
      break;
    case "B1":
      return { x: 1, y: 0 };
      break;
    case "B2":
      return { x: 1, y: 1 };
      break;
    case "B3":
      return { x: 1, y: 2 };
      break;
    case "B4":
      return { x: 1, y: 3 };
      break;
    case "B5":
      return { x: 1, y: 4 };
      break;
    case "B6":
      return { x: 1, y: 5 };
      break;
    case "B7":
      return { x: 1, y: 6 };
      break;
    case "B8":
      return { x: 1, y: 7 };
      break;
    case "B9":
      return { x: 1, y: 8 };
      break;
    case "B10":
      return { x: 1, y: 9 };
      break;
    case "C1":
      return { x: 2, y: 0 };
      break;
    case "C2":
      return { x: 2, y: 1 };
      break;
    case "C3":
      return { x: 2, y: 2 };
      break;
    case "C4":
      return { x: 2, y: 3 };
      break;
    case "C5":
      return { x: 2, y: 4 };
      break;
    case "C6":
      return { x: 2, y: 5 };
      break;
    case "C7":
      return { x: 2, y: 6 };
      break;
    case "C8":
      return { x: 2, y: 7 };
      break;
    case "C9":
      return { x: 2, y: 8 };
      break;
    case "C10":
      return { x: 2, y: 9 };
      break;
    case "D1":
      return { x: 3, y: 0 };
      break;
    case "D2":
      return { x: 3, y: 1 };
      break;
    case "D3":
      return { x: 3, y: 2 };
      break;
    case "D4":
      return { x: 3, y: 3 };
      break;
    case "D5":
      return { x: 3, y: 4 };
      break;
    case "D6":
      return { x: 3, y: 5 };
      break;
    case "D7":
      return { x: 3, y: 6 };
      break;
    case "D8":
      return { x: 3, y: 7 };
      break;
    case "D9":
      return { x: 3, y: 8 };
      break;
    case "D10":
      return { x: 3, y: 9 };
      break;
    case "E1":
      return { x: 4, y: 0 };
      break;
    case "E2":
      return { x: 4, y: 1 };
      break;
    case "E3":
      return { x: 4, y: 2 };
      break;
    case "E4":
      return { x: 4, y: 3 };
      break;
    case "E5":
      return { x: 4, y: 4 };
      break;
    case "E6":
      return { x: 4, y: 5 };
      break;
    case "E7":
      return { x: 4, y: 6 };
      break;
    case "E8":
      return { x: 4, y: 7 };
      break;
    case "E9":
      return { x: 4, y: 8 };
      break;
    case "E10":
      return { x: 4, y: 9 };
      break;
    case "F1":
      return { x: 5, y: 0 };
      break;
    case "F2":
      return { x: 5, y: 1 };
      break;
    case "F3":
      return { x: 5, y: 2 };
      break;
    case "F4":
      return { x: 5, y: 3 };
      break;
    case "F5":
      return { x: 5, y: 4 };
      break;
    case "F6":
      return { x: 5, y: 5 };
      break;
    case "F7":
      return { x: 5, y: 6 };
      break;
    case "F8":
      return { x: 5, y: 7 };
      break;
    case "F9":
      return { x: 5, y: 8 };
      break;
    case "F10":
      return { x: 5, y: 9 };
      break;
    case "G1":
      return { x: 6, y: 0 };
      break;
    case "G2":
      return { x: 6, y: 1 };
      break;
    case "G3":
      return { x: 6, y: 2 };
      break;
    case "G4":
      return { x: 6, y: 3 };
      break;
    case "G5":
      return { x: 6, y: 4 };
      break;
    case "G6":
      return { x: 6, y: 5 };
      break;
    case "G7":
      return { x: 6, y: 6 };
      break;
    case "G8":
      return { x: 6, y: 7 };
      break;
    case "G9":
      return { x: 6, y: 8 };
      break;
    case "G10":
      return { x: 6, y: 9 };
      break;
    case "H1":
      return { x: 7, y: 0 };
      break;
    case "H2":
      return { x: 7, y: 1 };
      break;
    case "H3":
      return { x: 7, y: 2 };
      break;
    case "H4":
      return { x: 7, y: 3 };
      break;
    case "H5":
      return { x: 7, y: 4 };
      break;
    case "H6":
      return { x: 7, y: 5 };
      break;
    case "H7":
      return { x: 7, y: 6 };
      break;
    case "H8":
      return { x: 7, y: 7 };
      break;
    case "H9":
      return { x: 7, y: 8 };
      break;
    case "H10":
      return { x: 7, y: 9 };
      break;
    case "I1":
      return { x: 8, y: 0 };
      break;
    case "I2":
      return { x: 8, y: 1 };
      break;
    case "I3":
      return { x: 8, y: 2 };
      break;
    case "I4":
      return { x: 8, y: 3 };
      break;
    case "I5":
      return { x: 8, y: 4 };
      break;
    case "I6":
      return { x: 8, y: 5 };
      break;
    case "I7":
      return { x: 8, y: 6 };
      break;
    case "I8":
      return { x: 8, y: 7 };
      break;
    case "I9":
      return { x: 8, y: 8 };
      break;
    case "I10":
      return { x: 8, y: 9 };
      break;
    case "J1":
      return { x: 9, y: 0 };
      break;
    case "J2":
      return { x: 9, y: 1 };
      break;
    case "J3":
      return { x: 9, y: 2 };
      break;
    case "J4":
      return { x: 9, y: 3 };
      break;
    case "J5":
      return { x: 9, y: 4 };
      break;
    case "J6":
      return { x: 9, y: 5 };
      break;
    case "J7":
      return { x: 9, y: 6 };
      break;
    case "J8":
      return { x: 9, y: 7 };
      break;
    case "J9":
      return { x: 9, y: 8 };
      break;
    case "J10":
      return { x: 9, y: 9 };
      break;
    default:
      return { x: 0, y: 0 };
      break;
  }
};

/**
 * Convert x and y coordinates to a chess notation style location.
 * The x/y coordinates start with 0 to be able to index arrays.
 *
 * coordinatesToLocation(0, 0) => A1
 * coordinatesToLocation(0, 1) => A2
 * coordinatesToLocation(1, 0) => B1
 * coordinatesToLocation(1, 1) => B2
 *
 * @param {number} x the x coordinate
 * @param {number} y the y coordinate
 * @returns {string}
 */
export const coordinatesToLocation = (x, y) => {
  // TODO
};

/**
 * Generate a random chess notation style location which fits into the bounds provided.
 *
 * @param {number} maxWidth the maximum size of the x-axis
 * @param {number} maxHeight the maximum size of the y-axis
 * @returns {string}
 */
export const generateLocation = (maxWidth, maxHeight) => {
  let maxWi = Math.floor(Math.random() * maxWidth);
  let nb;
  switch (maxWi) {
    case 1: {
      nb = "A";
    }
    case 2: {
      nb = "B";
    }
    case 3: {
      nb = "C";
    }
    case 4: {
      nb = "D";
    }
    case 5: {
      nb = "E";
    }
    case 6: {
      nb = "F";
    }
    case 7: {
      nb = "G";
    }
    case 8: {
      nb = "H";
    }
    case 9: {
      nb = "I";
    }
    case 10: {
      nb = "J";
    }
  }
  let nbe = Math.floor(Math.random() * maxHeight);
  return nb + nbe;
};

/**
 * Move a location along the x/y axis.
 * You must be able to handle positive and negative `dx`/`dy` values.
 * eg.:
 *
 * moveLocation('A1', 1, 1) => B2
 * moveLocation('A5', 0, -2) => A3
 *
 * @param {string} location the original location
 * @param {number} dx the number of tiles to move on the x-axis
 * @param {number} dy the number of tiles to move on the y-axis
 * @returns {string}
 */
export const moveLocation = (location, dx = 0, dy = 0) => {
  // TODO
};
