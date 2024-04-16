import { State } from "./game-state.js";
import { Player } from "./player.js";
import { generateLocation } from "./util.js";

export class AIPlayer extends Player {
  /**
   * When the AIPlayers plays his turn he has to...
   * - generate a random location from the opponents grid
   * - re-generate if the location has already been marked
   * - click the correct tile after 250ms
   */
  playTurn() {
    let location;
    do {
      location = generateLocation(12, 14);
    } while (State.opponent.grid.hasBeenMarked(location));
    if (State.currentPlayer != null) {
      setTimeout(() => {
        State.currentPlayer.grid.markTile(location); // Assuming this method also handles marking tiles as hit or miss.
        State.onTurn(location);
      }, 250);
    }
  }
}
