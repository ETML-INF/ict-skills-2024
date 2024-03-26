import { validateLocation } from "./util.js";

export class Grid {
  /**
   * When creating a new grid you will have to do the following tasks:
   *
   * - Assign arguments to class properties for later use
   * - Setup an empty tiles array
   * - Use the `grid-template-columns` and `grid-template-rows` styles on the DOM element
   *   to create a grid with the correct number of columns and rows, including the legend,
   *   with a respective size of 1fr.
   * - create the legend
   * - create all tiles
   *
   * @param {HTMLElement} element DOM Element of the grid
   * @param {number} width width of the grid
   * @param {number} height height of the grid
   */
  constructor(element, width, height) {
    this.element = element;
    this.width = width;
    this.height = height;
    this.tiles = []; // Setup an empty tiles array

    // Setup grid styles
    this.element.style.display = "grid";
    this.element.style.gridTemplateColumns = `repeat(${this.width + 1}, 1fr)`;
    this.element.style.gridTemplateRows = `repeat(${this.height + 1}, 1fr)`;

    this.createLegend(); // Call to create the legend
    this.createTiles(); // Call to create all tiles
  }

  /**
   * Create the legend for the x and y axis.
   *
   * Elements must...
   * - be a span element
   * - have the correct character (x-axis) or number (y-axis)
   * - have the class `grid-legend`
   * - have the class `grid-legend-x-axis` or `grid-legend-y-axis` respectively
   * - have the data attribute `data-legend` with value `x` or `y` respectively - eg. `data-legend="x"`
   * - be appended to the Grid DOM element (provided in constructor)
   *
   * Hint: CSS will automatically take care of the correct placement in the grid
   *       if all classes are assigned correctly
   */
  createLegend() {
    // X-axis legend
    for (let i = 0; i < this.width; i++) {
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
   * Create all playable tiles in the grid.
   *
   * You must...
   * - generate the correct location for each tile
   * - use `createSingleTile` to create a tile
   * - append all tiles to the Grid DOM element
   * - put all tiles in the `tiles` array of this class
   *
   * Hint: CSS will automatically take care of the correct placement in the grid
   *       if all classes are assigned correctly
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
   * Create a single tile with the provided location.
   *
   * The tile must...
   * - be a button
   * - have the `data-tile` attribute
   * - have the `data-location` attribute with the `location` as a value - eg. `data-location="A1"`
   *
   * @param {string} location the chess notation style location of this tile - eg. A1, B5, ...
   * @returns {HTMLButtonElement} the tile that was created
   */
  createSingleTile(location) {
    const tile = document.createElement("button");
    tile.setAttribute("data-tile", "");
    tile.setAttribute("data-location", location);
    return tile;
  }

  /**
   * Find a tile based on the location within the current grid.
   *
   * You must...
   * - make this work with upper and lowercase locations - eg. a1, B2, ...
   * - validate if the location format is correct
   * - throw a `InvalidTileFormatError` if the location format is not correct
   * - validate if the location is in bounds of the grid
   * - throw a `TileOutOfBoundsError` if the location is out of bounds of the grid
   *
   * @param {string} location the chess notation style location of this tile - eg. A1, B5, ...
   * @return {HTMLButtonElement}
   */
  findTile(location) {
    location = location.toUpperCase();
    if (!validateLocation(location)) {
      throw new Error("InvalidTileFormatError");
    }
    const tile = this.tiles.find(
      (t) => t.getAttribute("data-location") === location
    );
    if (!tile) {
      throw new Error("TileOutOfBoundsError");
    }
    return tile;
  }

  /**
   * Disable all tiles in the grid.
   */
  disable() {
    this.tiles.forEach((tile) => (tile.disabled = true));
  }

  /**
   * Enable all tiles in the grid expect the ones that have already been marked.
   */
  enable() {
    this.tiles.forEach((tile) => {
      if (!tile.hasAttribute("data-marked")) {
        tile.disabled = false;
      }
    });
  }

  /**
   * Mark the correct tile on the provided location
   *
   * The tile must...
   * - have the `data-marked` attribute
   * - be disabled
   *
   * @param {string} location the chess notation style location of this tile - eg. A1, B5, ...
   */
  markTile(location) {
    const tile = this.findTile(location);
    tile.setAttribute("data-marked", "");
    tile.disabled = true;
  }

  /**
   * Place a ship on the tile of the provided location
   * The tile must have the `data-ship` attribute.
   *
   * @param {string} location the chess notation style location of this tile - eg. A1, B5, ...
   */
  placeShipOnTile(location) {
    const tile = this.findTile(location);
    tile.setAttribute("data-ship", "");
  }

  /**
   * Determine if the tile of the provided location has already been marked
   *
   * @param {string} location the chess notation style location of this tile - eg. A1, B5, ...
   * @returns {boolean}
   */
  hasBeenMarked(location) {
    const tile = this.findTile(location);
    return tile.hasAttribute("data-marked");
  }

  /**
   * Determine the number of hit ship-tiles.
   *
   * @returns {number}
   */
  getNumberOfHits() {
    return this.tiles.filter(
      (tile) =>
        tile.hasAttribute("data-marked") && tile.hasAttribute("data-ship")
    ).length;
  }
}
