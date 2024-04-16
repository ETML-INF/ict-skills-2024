import { validateLocation } from "./util.js";

export class Grid {
  /**
   * When creating a new grid, you need to perform the following tasks:
   * - Assign constructor arguments to class properties
   * - Initialize an empty array for tiles
   * - Set grid display styles on the DOM element to create a grid with the specified number of columns and rows
   * - Create the legend and all tiles
   *
   * @param {HTMLElement} element - The DOM Element for the grid
   * @param {number} width - Width of the grid
   * @param {number} height - Height of the grid
   */
  constructor(element, width, height) {
    this.element = element;
    this.width = width;
    this.height = height;
    this.tiles = [];

    this.element.style.display = "grid";
    this.element.style.gridTemplateColumns = `repeat(${this.width + 1}, 1fr)`;
    this.element.style.gridTemplateRows = `repeat(${this.height + 1}, 1fr)`;

    this.createLegend();
    this.createTiles();
  }

  /**
   * Creates the legend for the x and y axes with appropriate classes and data attributes.
   */
  createLegend() {
    // X-axis legend
    for (let i = 1; i <= this.width; i++) {
      const charCode = "A".charCodeAt(0) + i;
      const span = document.createElement("span");
      span.className = "grid-legend grid-legend-x-axis";
      span.textContent = String.fromCharCode(charCode);
      span.setAttribute("data-legend", "x");
      this.element.appendChild(span);
    }

    // Y-axis legend
    for (let i = 1; i <= this.height; i++) {
      const span = document.createElement("span");
      span.className = "grid-legend grid-legend-y-axis";
      span.textContent = i.toString();
      span.setAttribute("data-legend", "y");
      this.element.appendChild(span);
    }
  }

  /**
   * Generates and appends tiles to the grid and stores them in an array.
   */
  createTiles() {
    for (let y = 1; y <= this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const charCode = "A".charCodeAt(0) + x;
        const location = `${String.fromCharCode(charCode)}${y}`;
        const tile = this.createSingleTile(location);
        this.tiles.push(tile);
        this.element.appendChild(tile);
      }
    }
  }

  /**
   * Creates a single tile with a specified location.
   *
   * @param {string} location - The chess notation style location of this tile
   * @returns {HTMLButtonElement} - The created tile
   */
  createSingleTile(location) {
    const tile = document.createElement("button");
    tile.className = "grid-tile"; // Added class for styling purposes
    tile.setAttribute("data-tile", "");
    tile.setAttribute("data-location", location);
    return tile;
  }

  /**
   * Finds a tile based on the location within the current grid, handling case sensitivity and location validation.
   *
   * @param {string} location - The chess notation style location of this tile
   * @return {HTMLButtonElement} - The found tile
   */
  findTile(location) {
    if (typeof location !== "string" || location.trim() === "") {
      throw new Error(`Invalid format "${location}" for tile location.`);
    }

    location = location.toUpperCase();
    const isValidFormat = /^[A-Z]\d+$/; // Assure que le format est une lettre suivie de chiffres
    if (!isValidFormat.test(location)) {
      throw new Error(`Invalid format "${location}" for tile location.`);
    }

    if (!validateLocation(location)) {
      throw new Error(`Location "${location}" out of bounds.`);
    }

    const tile = this.tiles.find(
      (t) => t.getAttribute("data-location") === location
    );
    if (!tile) {
      throw new Error(`Location "${location}" out of bounds.`);
    }
    return tile;
  }

  /**
   * Disables all tiles in the grid.
   */
  disable() {
    this.tiles.forEach((tile) => (tile.disabled = true));
  }

  /**
   * Enables all tiles in the grid except those that are marked.
   */
  enable() {
    this.tiles.forEach((tile) => {
      if (!tile.hasAttribute("data-marked")) {
        tile.disabled = false;
      }
    });
  }

  /**
   * Marks a tile as used based on the provided location, disabling it.
   *
   * @param {string} location - The chess notation style location of this tile
   */
  markTile(location) {
    const tile = this.findTile(location);
    tile.setAttribute("data-marked", "");
    tile.disabled = true;
  }

  /**
   * Places a ship on the tile at the specified location.
   *
   * @param {string} location - The chess notation style location of this tile
   */
  placeShipOnTile(location) {
    const tile = this.findTile(location);
    tile.setAttribute("data-ship", "");
  }

  /**
   * Checks if a tile at the specified location has been marked.
   *
   * @param {string} location - The chess notation style location of this tile
   * @returns {boolean} - True if the tile has been marked, otherwise false
   */
  hasBeenMarked(location) {
    const tile = this.findTile(location);
    return tile !== undefined && tile.hasAttribute("data-marked");
  }

  /**
   * Counts the number of tiles that have been hit.
   *
   * @returns {number} - The number of tiles that have been hit
   */
  getNumberOfHits() {
    return this.tiles.filter(
      (tile) =>
        tile.hasAttribute("data-marked") && tile.hasAttribute("data-ship")
    ).length;
  }
}
