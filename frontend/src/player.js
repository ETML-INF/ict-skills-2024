import { ShipGenerator } from "../lib/ship-generator.js";
import { Grid } from "./grid.js";

export class Player {
  /**
   * When creating a new Player you will have to do the following tasks:
   *
   * - Assign arguments to class properties for later use
   * - Use the static `ShipGenerator` class to generate the ships of this player
   * - Place the ships in the grid
   *
   * @param {Grid} grid
   */
  constructor(grid) {
    this.grid = grid;

    // Use ShipGenerator to generate ships. This might be an array of arrays,
    // with each sub-array representing a ship and containing the locations of its tiles.
    this.ships = ShipGenerator.generateShips(this.grid.width, this.grid.height);

    // Place the ships on the grid
    this.placeShips();
  }

  /**
   * Places ships on the grid based on the generated ship locations.
   */
  placeShips() {
    for (const ship of this.ships) {
      for (const location of ship) {
        this.grid.placeShipOnTile(location);
      }
    }
  }

  /**
   * Determine the sum of all ship-tiles.
   *
   * @returns {number}
   */
  getNumberOfShipTiles() {
    // Assuming each ship is represented by an array of its tile locations,
    // the total number of ship tiles is simply the sum of the lengths of these arrays.
    return this.ships.reduce((sum, ship) => sum + ship.length, 0);
  }
}
