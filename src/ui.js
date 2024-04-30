/**
 * Regional Championship 2024 - Skill 17 - Web Technologies
 * Frontend
 *
 * Your task is to implement all methods marked with @todo.
 * You are allowed to add additional methods and variables to this file if you need to.
 * You are not allowed to change the signature of or delete existing methods.
 */

/**
 * Create a tr > td structure inside the table (ID "board") resembling the 64 squares of a chess board.
 */
export function createBoard() {
    let table = document.getElementById("board");
    for (let i = 0; i < 8; i++) {
        let tr = document.createElement("tr");
        table.appendChild(tr);
        for(let j = 0; j < 8; j++) {
            let td = document.createElement("td");
            td.id = `${j} ${i}`;
            tr.appendChild(td);
        }
    }
}

/**
 * Get the td-Element at the square coordinate provided.
 * @param {import("./util").Square} square
 */
export function getSquare(square) {
    const alphabet = ["a", "b", "c", "d", "e", "f", "g", "h"];
    const letter = alphabet.indexOf(square[0]);
    let number = parseInt(square[1], 10) - 1;
    if(number == 7) {
        number = 0;
    } else if(number == 6) {
        number = 1;
    } else if(number == 5) {
        number = 2;
    } else if(number == 4) {
        number = 3;
    } else if(number == 3) {
        number = 4;
    } else if(number == 2) {
        number = 5;
    } else if(number == 1) {
        number = 6;
    } else if(number == 0) {
        number = 7;
    }
    return document.getElementById(`${letter} ${number}`);
}

function changeNum(num) {
    switch(num) {
        case 0:
            return 7;
        case 1:
            return 6;
        case 2:
            return 5;
        case 3:
            return 4;
        case 4:
            return 3;
        case 5:
            return 2;
        case 6:
            return 1;
        case 7:
            return 0;
    }
}

/**
 * Sets the background image of each cell with their piece. The background images are located in `lib/pieces`.
 * @param {import("./pieces.js").Piece[]} position
 */
export function renderPieces(position) {
    const alphabet = ["a", "b", "c", "d", "e", "f", "g", "h"]
    position.forEach((pos) => {
        let td = document.getElementById(`${alphabet.indexOf(pos.square[0])} ${changeNum(parseInt(pos.square[1]) - 1)}`)
        if(pos.notation == "R") {
            (pos.color == "w") ? td.style.backgroundImage = "url('lib/pieces/wr.png')" : td.style.backgroundImage = "url('lib/pieces/br.png')";
        } else if(pos.notation == "N") {
            (pos.color == "w") ? td.style.backgroundImage = "url('lib/pieces/wn.png')" : td.style.backgroundImage = "url('lib/pieces/bn.png')";
        } else if(pos.notation == "B") {
            (pos.color == "w") ? td.style.backgroundImage = "url('lib/pieces/wb.png')" : td.style.backgroundImage = "url('lib/pieces/bb.png')";
        } else if(pos.notation == "Q") {
            (pos.color == "w") ? td.style.backgroundImage = "url('lib/pieces/wq.png')" : td.style.backgroundImage = "url('lib/pieces/bq.png')";
        } else if(pos.notation == "K") {
            (pos.color == "w") ? td.style.backgroundImage = "url('lib/pieces/wk.png')" : td.style.backgroundImage = "url('lib/pieces/bk.png')";
        } else {
            (pos.color == "w") ? td.style.backgroundImage = "url('lib/pieces/wp.png')" : td.style.backgroundImage = "url('lib/pieces/bp.png')";
        }
    });
}

/**
 * Clear the whole board of its pieces, removing the background images of all squares.
 */
export function clearPieces() {
    for(let i=0; i < 8; i++) {
        for(let j = 0; j < 8; j++) {
            let td = document.getElementById(`${j} ${i}`);
            td.style.backgroundImage = "";
        }
    }
}

/**
 * Show the names of white and black players and the result of the game at their corresponding spot in the DOM.
 * In the <header> element you will find spans with ID's #white, #black and #result.
 * The parameter `game` contains the infos from the PGN.
 *
 * @param {import("./util").Game} game
 */
export function renderGameInfo(game) {
    document.querySelector("#white").textContent = `${game.white}`;
    document.querySelector("#black").textContent = `${game.black}`;
    document.querySelector("#result").textContent = `${game.result}`;
}

/**
 * Create a promise that resolves to the PGN-string of the game.
 *
 * 1. user must upload a file - via the input type="file" at ID #game-input
 * 2. file must be read - hint: https://developer.mozilla.org/en-US/docs/Web/API/FileReader
 * 3. dialog must be closed - hint: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog
 * 4. promise must be resolved with the files content (PGN-string)
 *
 * @returns {Promise<string>} Portable Game Notation (PGN)
 */
export function selectGame() {
    // GAME IS THE HTML ELEMENT AKIFNEJGNSEJGNBIEJGBEHT (ITS NOT SUPPSOED TO BE)

        return new Promise((resolve, reject) => {
      
            const game = document.getElementById("game-input");

          if (game != null) {
            resolve(game);
          } else {
            reject(Error("game is null"));
          }
        });
}

/*
let selectGamePromise = new Promise(function(getGameInputElement) {
    getGameInputElement();
})
return(selectGamePromise);

function getGameInputElement() {
    const game = document.getElementById("game-input");
    return(game);
}

function getGameInputElementFail() {
    alert("invalid file");
}*/
