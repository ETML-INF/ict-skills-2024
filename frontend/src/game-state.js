import { AIPlayer } from "./ai-player.js";
import { Grid } from "./grid.js";
import { Player } from "./player.js";

export class GameState {
  constructor() {
    this.currentPlayer = null;
    this.opponent = null;
    this.dialog = document.createElement("dialog"); // Assuming dialog is prepared in HTML and referenced here
  }

  /**
   * Assign the players.
   * Enable/Disable the correct grids.
   *
   * @param {Player} player1 the player who should have the first turn
   * @param {Player} player2 the second player
   */
  setPlayers(player1, player2) {
    this.currentPlayer = player1;
    this.opponent = player2;

    // Assuming Player class has enable() and disable() methods to manage their grid's interactivity
    this.currentPlayer.grid.disable();
    this.opponent.grid.enable();
  }

  /**
   * Switch the players (`currentPlayer` and `opponent`).
   * Enable/Disable the correct grids.
   */
  switchPlayers() {
    [this.currentPlayer, this.opponent] = [this.opponent, this.currentPlayer];

    this.currentPlayer.grid.disable();
    this.opponent.grid.enable();
  }

  /**
   * On a turn you have to do the following:
   *
   * - mark the correct tile on the correct grid
   * - check if the player has won - if so, open the winning dialog
   * - switch the players
   * - if the next player is an AI invoke a turn by calling `playTurn()`
   *
   * @param {string} location the chess notation style location - eg. A1, B5, ...
   */
  onTurn(location) {
    this.currentPlayer.grid.markTile(location);

    if (this.checkWin()) {
      this.openWinningDialog();
      return;
    }

    this.switchPlayers();

    if (this.currentPlayer instanceof AIPlayer) {
      this.currentPlayer.playTurn();
    }
  }

  /**
   * Determine if the current player has won the game by sinking all ships.
   *
   * @returns {boolean}
   */
  checkWin() {
    return (
      this.opponent.getNumberOfShipTiles() ===
      this.opponent.grid.getNumberOfHits()
    );
  }

  /**
   * Open the winning dialog (provided in the HTML as a <dialog> element)
   * as a modal and show one of the following messages respectively:
   * - "AI wins!"
   * - "Player wins!"
   */
  openWinningDialog() {
    const message =
      this.currentPlayer instanceof AIPlayer ? "AI wins!" : "Player wins!";
    this.dialog.textContent = message; // Clear existing text and add new message
    this.dialog.showModal(); // Use show() if you don't want it to be modal
  }
}

// initialize state and export for further use
export const State = new GameState();
