import { ShipGenerator } from "../lib/ship-generator.js";
import { Grid } from "./grid.js";

export class Player {
  constructor(grid) {
    this.grid = grid;
    this.ships = ShipGenerator.generateShips(this.grid.width, this.grid.height);
    this.placeShips();
  }

  placeShips() {
    for (const ship of this.ships) {
      for (const location of ship) {
        this.grid.placeShipOnTile(location);
      }
    }
  }

  getNumberOfShipTiles() {
    return this.ships.reduce((sum, ship) => sum + ship.length, 0);
  }
}
