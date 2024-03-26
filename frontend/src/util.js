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
  if (!/^[A-J](10|[1-9])$/.test(location)) {
    throw new InvalidTileFormatError("Location format is incorrect");
  }

  const x = location.charCodeAt(0) - "A".charCodeAt(0);
  const y = parseInt(location.substring(1), 10) - 1;

  if (x < 0 || x >= maxWidth || y < 0 || y >= maxHeight) {
    throw new TileOutOfBoundsError("Location is out of bounds");
  }

  return true;
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
  const x = location.charCodeAt(0) - "A".charCodeAt(0);
  const y = parseInt(location.slice(1)) - 1;
  return { x, y };
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
  const letter = String.fromCharCode("A".charCodeAt(0) + x);
  const number = y + 1;
  return `${letter}${number}`;
};

/**
 * Generate a random chess notation style location which fits into the bounds provided.
 *
 * @param {number} maxWidth the maximum size of the x-axis
 * @param {number} maxHeight the maximum size of the y-axis
 * @returns {string}
 */
export const generateLocation = (maxWidth, maxHeight) => {
  const x = Math.floor(Math.random() * maxWidth);
  const y = Math.floor(Math.random() * maxHeight) + 1; // Ensure y is 1-indexed
  const letter = String.fromCharCode("A".charCodeAt(0) + x);
  return `${letter}${y}`;
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
  const { x, y } = locationToCoordinates(location);
  const newX = x + dx;
  const newY = y + dy;
  // Ensure the new coordinates are within bounds
  if (newX >= 0 && newX <= 9 && newY >= 0 && newY <= 9) {
    return coordinatesToLocation(newX, newY);
  }
  // Optionally handle out-of-bounds movement
  throw new Error("New location is out of bounds");
};
