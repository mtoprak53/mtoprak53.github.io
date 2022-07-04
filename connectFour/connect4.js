/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  // TODO: set "board" to empty HEIGHT x WIDTH matrix array
  const row = [];
  for (let w = 0; w < WIDTH; w++) {
    row.push(null);
  }
  for (let h = 0; h < HEIGHT; h++) {
    board.push([...row]);   // to make copies of row
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
  const htmlBoard = document.querySelector('#board');

  // TODO: add comment for this code
  // creating "top" row of the "htmlBoard" & adding a click Event Listener
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  for (var x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    headCell.innerHTML = `${x + 1}`;
    top.append(headCell);
  }
  htmlBoard.append(top);

  // TODO: add comment for this code
  // creating (HEIGHT x WIDTH) HTML table to represent htmlBoard
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  // TODO: write the real version of this, rather than always returning 0

  for (let i = 0; i < HEIGHT; i++) {
    let j = HEIGHT - 1 - i;
    console.log(j);
    if (board[j][x] === null) {
      console.log(j);
      return j;
    }
  }
  return null;


  // for (let i = 0; i < HEIGHT; i++) {
  //   let j = HEIGHT - 1 - i;
  //   const cell = document.querySelector(`[id="${j}-${x}"]`);
  //   // console.log(cell);   // TEST
  //   if (!cell.innerHTML) {
  //     return j;
  //   }
  // }
  // return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // TODO: make a div and insert into correct table cell
  const piece = document.createElement('div');
  piece.setAttribute("class", "piece");
  piece.classList.add(`p${currPlayer}`);
  // querySelector does not support IDs starting with a digit
  const cell = document.querySelector(`[id="${y}-${x}"]`);
  cell.append(piece);
}

/** endGame: announce game end */

function endGame(msg) {
  // TODO: pop up alert message
  setTimeout(() => alert(msg), 50);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  const x = +evt.target.id;   // ATTENTION TO '+' SIGN

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  // TODO: add line to update in-memory board
  console.log(y, x);   // TEST
  placeInTable(y, x);
  console.log(y, x);   // TEST

  board[y][x] = currPlayer;
  
  // for (let a = 0; a < HEIGHT; a++) {
  //   for (let b = 0; a < WIDTH; b++) {
  //     if ( a === y && b === x) {
  //       board[a][b] = currPlayer;
  //     }
  //   }
  // }

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  // TODO: check if all cells in board are filled; if so call, call endGame

  if (board[0].every( val => val === 1 || val === 2)) {
    return endGame("IT IS A TIE!");
  }

  // for (let i = 0; i < WIDTH; i++) {
  //   const cell = document.querySelector(`[id="${0}-${i}"]`);
  //   if (!cell.innerHTML) {
  //     break;
  //   }
  //   if(i === WIDTH - 1) {
  //     return endGame("IT IS A TIE!");
  //   }
  // }

  // switch players
  // TODO: switch currPlayer 1 <-> 2
  currPlayer = currPlayer === 1 ? 2 : 1;
  console.log(`Current Player: ${currPlayer}`);   // TEST
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // TODO: read and understand this code. Add comments to help you.
  // for every single cell
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      // create possible winning 4 cell arrays:
      // 1) rightward
      // 2) downward
      // 3) diagonally downward & rightward
      // 4) diagonally downward & leftward
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
      
      // check if any of them wins
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
