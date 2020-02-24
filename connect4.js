/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */


 /*
  Questions for Mentor/Code Review:

  - Should the click handler really be method of the Game Class? 
  - Use of _win as a "private" method...we haven't really discussed "private" methods. 
    Benefit of making it private in this case? When to make private? Use of '#' to make it private vs "_"
  - The following line in 'placeInTable(y, x)' doesn't appear to do anything: // piece.style.top = -50 * (y + 2)
    unless I'm missing something
   
 
 */

//  let gameActive = false;

class Game {
  constructor(p1, p2, HEIGHT = 6, WIDTH = 7, DEFAULT_PLAYER1_COLOR = "blue", DEFAULT_PLAYER2_COLOR = "red") {
    this.players = [p1, p2];
    this.HEIGHT = HEIGHT;
    this.WIDTH = WIDTH;
    this.DEFAULT_PLAYER1_COLOR = DEFAULT_PLAYER1_COLOR,
    this.DEFAULT_PLAYER2_COLOR = DEFAULT_PLAYER2_COLOR,
    this.currPlayer = p1; // active player: 1 or 2
    this.board = []; // array of rows, each row is array of cells  (board[y][x])
    this.gameIsOver = false;

  }
 
  /* Initialize the game when user clicks the start button */

  initGame() {
    /* If a HTML game board already exist when start game is clicked remove it first before 
    *  adding a fresh new game board 
    */

    // Game.activateGame = true;
    let clearHtmlBoard = () => {
      let board = document.querySelector("#board"); 
      if (board.lastElementChild !== null ) {

        var child = board.lastElementChild;  
        while (child) { 
            board.removeChild(child); 
            child = board.lastElementChild; 
        }
      }
    }
    
    clearHtmlBoard(); // Clear any remnants of game board from prior board
    this.makeBoard();  // Create a fresh gameBoard data structure
    this.makeHtmlBoard(); // Create a fresh HTML Board for the new game
  }

  /** makeBoard: create in-JS board structure:
  *   board = array of rows, each row is array of cells  (board[y][x])
  *   at creation each cell of the board is initialized to undefined, undefined
  */
  makeBoard() {
    for (let y = 0; y < this.HEIGHT; y++) {
      this.board.push(Array.from({ length: this.WIDTH }));
    }
  };

  makeHtmlBoard () {
    const board = document.getElementById('board');

    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    this.handleClick = this.handleClick.bind(this);
    top.addEventListener('click', this.handleClick);

    for (let x = 0; x < this.WIDTH; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }

    board.append(top);

    // make main part of board
    for (let y = 0; y < this.HEIGHT; y++) {
      const row = document.createElement('tr');

      for (let x = 0; x < this.WIDTH; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }

      board.append(row);
    }
  }

  /** findSpotForCol: given column x, return top empty y (null if filled) */

  findSpotForCol(x) {
    for (let y = this.HEIGHT - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  /** placeInTable: update DOM to place piece into HTML table of board */

  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.style.backgroundColor = this.currPlayer.color;
    //***********Don't think this line does anything
    // piece.style.top = -50 * (y + 2);
    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  /** endGame: announce game end */

  endGame(msg) {
    const topRow = document.querySelector('#column-top');
    alert(msg);
    if (this.gameIsOver) {
      // After game is over disable the hover event by looping over all Tds and setting pointer-events = "none"
      let topRowTdNodes = document.querySelectorAll('#column-top td');
      topRowTdNodes.forEach((td) => td.style.pointerEvents = "none");
      // Remove the event listener to prevent user from adding more pieces after the game is over
      topRow.removeEventListener('click', this.handleClick);
      topRow.classList.remove("active-game");

    }
  }

  /** handleClick: handle click of column top to play piece */

  handleClick(evt) {
    // get x from ID of clicked cell
    const x = +evt.target.id;

    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);
    
    // check for win
    if (this.checkForWin()) {
      this.gameIsOver = true;
      return this.endGame(`Player ${this.currPlayer.color} won!`);
    }
    
    // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('Tie!');
    }
      
    // switch players
    this.currPlayer = this.currPlayer === this.players[0] ? this.players[1] : this.players[0];
  }

  /** checkForWin: check board cell-by-cell for "does a win start here?" */

  checkForWin() {
    // NOTE: For some reason I couldn't get it to work with _win() as function within checkForWin method.
    // TODO: Need to investigate and try and fix it. 

    let x, y;

    const _win = (cells) => {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer
      return cells.every(
    
        ([y, x]) =>
          y >= 0 &&
          y < this.HEIGHT &&
          x >= 0 &&
          x < this.WIDTH &&
          this.board[y][x] === this.currPlayer
      );
      
    }

    for (y = 0; y < this.HEIGHT; y++) {
      for (x = 0; x < this.WIDTH; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        // find winner (only checking each win-possibility as needed)
        // if (this._win(horiz) || this._win(vert) || this._win(diagDR) || this._win(diagDL)) {
        if (_win(horiz, x, y) || _win(vert, x, y) || _win(diagDR, x, y) || _win(diagDL, x, y)) {
          return true;
        }
      }
    }
  }
}
class Player {
  constructor (color) {
    this.color = color;
  }

}

/**
 * Called when the user has already started a game and then tries to change player colors in 
 * mid game and one of the colors they want to use is not valid so game is paused until the 
 * user fixes the error...after which the game must be restarted for it to continue.
 */

function pauseGame() {
  const topRow = document.getElementById('column-top');
  if (topRow) {
    topRow.classList.remove("active-game");
    //Disable the hover event by looping over all Tds and setting pointer-events = "none"
    let topRowTdNodes = document.querySelectorAll('#column-top td');
    topRowTdNodes.forEach((td) => td.style.pointerEvents = "none");
    // Remove the event listener to prevent user from adding more pieces after the game is over
    document.querySelector('#column-top').removeEventListener('click', this.handleClick);
  }

}

/**
 * Checks to make sure color entered is valid color string
 * - Return True if player color entered is a valid color
 * - Retun False if player color entered is not valid color
 */
isValidColor = (strColor) => {
  var s = new Option().style;
  s.color = strColor;
  return s.color == strColor;
}

/**
 * Get the Player's input values, validate them and if necessary create display error 
 * messages if any Player colors are invalid and pause the game to prevent the user from continue
 * play until the player input has been corrected after which the user must restart the game to 
 * continue playing 
 */
const processPlayerInput = () => {

  const DEFAULT_PLAYER1_COLOR = "blue";
  const DEFAULT_PLAYER2_COLOR = "red";

  // Player form fields
  const player1ColorInputField = document.getElementById('p1-color');
  const player2ColorInputField = document.getElementById('p2-color');

  // Get player input
  let player1ColorInputValue = player1ColorInputField.value.trim().toLowerCase();
  let player2ColorInputValue = player2ColorInputField.value.trim().toLowerCase();

  // If no player color is input then display the default color so players know which color represents each player 
  player1Color = (player1ColorInputValue === "") ? DEFAULT_PLAYER1_COLOR : player1ColorInputField.value.trim().toLowerCase();
  player2Color = (player2ColorInputValue === "") ? DEFAULT_PLAYER2_COLOR : player2ColorInputField.value.trim().toLowerCase();
  player1ColorInputField.value = player1Color;
  player2ColorInputField.value = player2Color;

  // if color entered is not a valid color then display and log an error message and pause the game until error is corrected
  if (!isValidColor(player1ColorInputValue)) {
    const p1ErrMsg = `Player 1's color '${document.getElementById('p1-color').value}' is not a valid color please try another color`;
    console.log(p1ErrMsg);
    buildAndDisplayErrorMsg(p1ErrMsg);
    player1Color = null;  // Null value will prevent game from being initiated
    pauseGame();  
  } 

  if (!isValidColor(player2ColorInputValue) ) {
    const p2ErrMsg = `Player 2's color '${document.getElementById('p2-color').value}' is not a valid color please try another color`;
    console.log(p2ErrMsg);
    buildAndDisplayErrorMsg(p2ErrMsg);
    player2Color = null;
    pauseGame();
  }

   return { 
    player1Color,
    player2Color 
  }

}

buildErrMsgDiv = () => {
  const errMsgDiv = document.createElement("div");
  errMsgDiv.setAttribute("class", "error-msg");
  return errMsgDiv;
}

buildErrMsgBtn = () => {
  const errMsgBtn = document.createElement("button");
  errMsgBtn.setAttribute("class", "err-msg-btn");
  errMsgBtn.innerText = "X";
  return errMsgBtn;
}

buildErrMsgTxt = (errMsgText) => {
  const errMsgTxtSpan = document.createElement("span");
  errMsgTxtSpan.setAttribute("class", "err-msg-txt");
  errMsgTxtSpan.innerText = errMsgText;
  return errMsgTxtSpan;

}

buildAndDisplayErrorMsg = (errMsgText) => {
  const errMsgArea = document.getElementById("err-msg-area");

  const errMsgDiv = buildErrMsgDiv();
  const errMsgBtn = buildErrMsgBtn();
  const errMsgTxt = buildErrMsgTxt(errMsgText);
 
  errMsgDiv.append(errMsgBtn);
  errMsgDiv.append(errMsgTxt);
  errMsgArea.append(errMsgDiv);

  // Disable game start game button until all error messages have been cleared
  document.getElementById('start-btn').disabled = true;
}


const handleGameStart = () =>  {
  let player1, player2;
  // let errMsg; 

  let playerColors = processPlayerInput();
  
  // if valid color entered for player1 then create player 1
  if (playerColors.player1Color) {
    player1 = new Player (playerColors.player1Color);
  } 

  // if valid color entered for player2 then create player 2
  if (playerColors.player2Color) {
    player2 = new Player (playerColors.player2Color);
  } 

  // Game will not be started until both player's colors are valid
  if (playerColors.player1Color && playerColors.player2Color) {
    
    let connect4 = new Game(player1, player2);
    connect4.initGame();
    // document.getElementById('column-top').style.backgroundColor = "palegreen";
    document.getElementById('column-top').classList.add("active-game");

  } 

}

/**
 * Clear Player's input field when error message is cleared
 * And put focus and cursor on errant input field so user can change color value
 */
const clearErrantPlayerColorInput = (elemClicked) => {
  const errMsgText = elemClicked.nextSibling.innerText;
  const player1Input = document.getElementById('p1-color');
  const player2Input = document.getElementById('p2-color');


  if (errMsgText.includes("Player 1") ) {
    player1Input.value = "";
    player1Input.focus();
    player1Input.select();

  } else {
    player2Input.value = "";
    player2Input.focus();
    player2Input.select();
  }

}
// Remove Div containing the error message and it's delete button from the DOM
function deleteErrorMsg(deleteBtnClicked) {
  const errMsgDiv = deleteBtnClicked.parentNode;
  errMsgDiv.parentNode.removeChild(errMsgDiv);
}

/**
 * Clear the error message when the user clicks it's delete button
 * Re-enable start game button if no more error messages
 * @param {*} evt 
 */
function handleDeleteBtn(evt) {
  const errMsgArea = document.getElementById("err-msg-area");
  const startBtn = document.getElementById("start-btn");
  const elemClicked = evt.target;

  if (elemClicked.nodeName === "BUTTON") {  // Only handle click events on the ErrMsg delete button
    // Clear errant color input and set cursor focus and position in input field containing errant color
    clearErrantPlayerColorInput(elemClicked);
    deleteErrorMsg (elemClicked);
    // If all error messages have been cleared then re-enable the Start Game button
    if (errMsgArea.childElementCount === 0 ) {
      startBtn.disabled = false;
    }
  }
}
 
/* Game Start Button event listner*/
document.querySelector("#start-btn").addEventListener('click', handleGameStart); 

/* User clicks delete button for error message */
document.querySelector('#err-msg-area').addEventListener('click', handleDeleteBtn) 
