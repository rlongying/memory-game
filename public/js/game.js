import { getRndIntegers } from "./util.js";
import { GameConfig, Audio, UIText } from "./constatns.js";

// matrix dimension, min 5x5
let matrixRow = GameConfig.minRow;
let matrixCol = GameConfig.minColumn;

// number of tiles, initial value 5
let tiles = GameConfig.tiles;
let trial = GameConfig.trial;
let score = GameConfig.score;

// how many tiles have been clicked
let clickCount = tiles;
let hasError = false; // has chosen wrong cards

const updateTiles = newTiles => {
  tiles = newTiles;

  let tilesSpan = document.getElementById("tiles");
  tilesSpan.textContent = tiles;
};

const updateTrial = newTrial => {
  trial = newTrial;

  let trialSpan = document.getElementById("trial");
  trialSpan.textContent = trial;
};

const updateScore = newScore => {
  score = newScore;

  let scoreSpan = document.getElementById("score");
  scoreSpan.textContent = score;
};

const resetGameNumbers = () => {
  // reset game info display
  updateTrial(GameConfig.trial);
  updateTiles(GameConfig.tiles);
  updateScore(GameConfig.score);
  matrixCol = GameConfig.minColumn;
  matrixRow = GameConfig.minRow;
  hasError = false;
  clickCount = tiles;
};

const playSound = soundId => {
  let audio = document.getElementById(soundId);
  audio.currentTime = 0;
  audio.play();
};

let checkCard = event => {
  let card = event.target;
  let hasSelected = card.dataset.selected;

  if (hasSelected === "true") {
    updateScore(score + 1);
    // click correct card
    if (!hasError && clickCount === 1) {
      // correct card and is the last card
      card.classList.add("success-card");
      playSound(Audio.lastSuccess);
    } else {
      // not last card
      card.classList.add("flip-card-single");
      playSound(Audio.flipSuccess);
    }
  } else {
    updateScore(score - 1);
    // clicked wrong card
    hasError = true;
    card.classList.add("error-card");
    playSound(Audio.flipError);
  }

  clickCount--;

  card.removeEventListener("click", checkCard);

  // no more clicks allowed
  if (clickCount == 0) {
    flipMissedCards();
    setTimeout(() => {
      if (!hasError) {
        playSound(Audio.newGameSuccess);
      }
      if (score > 0) {
        startNewRound();
      } else {
        terminateGame(null);
      }
    }, 2000);
  }
};

const flipMissedCards = () => {
  const cards = document.querySelectorAll(".card");
  cards.forEach(card => {
    if (
      card.dataset.selected === "true" &&
      !card.classList.contains("flip-card-single")
    ) {
      card.classList.add("flip-card-single");
    }
  });
};

const reSetTiles = () => {
  const cards = document.querySelectorAll(".card");

  const selectedCardsIndex = getRndIntegers(0, matrixCol * matrixRow, tiles);

  cards.forEach((card, key) => {
    if (selectedCardsIndex.includes(key)) {
      // add flip class
      card.dataset.selected = "true";
      card.classList.add("flip-card-double");
    } else {
      card.dataset.selected = "false";
      card.classList.remove("flip-card-double");
    }
  });
};

const removeAllChild = element => {
  while (element.lastChild) {
    element.removeChild(element.lastChild);
  }
};

const createMatrix = (row, col) => {
  // create container
  let gameContainer = document.getElementById("game-container");
  if (gameContainer) {
    gameContainer.remove();
  }

  gameContainer = document.createElement("div");
  gameContainer.id = "game-container";
  gameContainer.classList.add("column");
  document.getElementById("container").appendChild(gameContainer);

  for (let i = 0; i < row; i++) {
    // create a row
    let rowDiv = document.createElement("div");
    rowDiv.classList.add("row");

    for (let j = 0; j < col; j++) {
      // create a tile
      let tileDiv = document.createElement("div");
      tileDiv.classList.add("card");
      tileDiv.dataset.selected = "false";
      tileDiv.addEventListener("click", checkCard);
      rowDiv.appendChild(tileDiv);
    }
    gameContainer.appendChild(rowDiv);
  }
};

const rotateMatrix = () => {
  let container = document.getElementById("game-container");

  // add rotate class
  container.classList.add("rotate-matrix");
};

const terminateGame = event => {
  if (event) {
    //event not null, terminate by 'terminate' button
    if (confirm("Are you sure to terminate the game?")) {
      // yes
      // console.log("confirm termination");
      // send http request to redirect to summary page
      window.location = "/summary?score=" + score;
      resetGameNumbers();
    }
  } else {
    let terminateBtn = document.getElementById("terminate-btn");
    terminateBtn.textContent = UIText.restartBtn;
    terminateBtn.removeEventListener("click", terminateGame);
    terminateBtn.addEventListener("click", restartGame);
  }

  // cancel do nothing
};

const restartGame = e => {
  e.target.removeEventListener("click", restartGame);
  e.target.addEventListener("click", terminateGame);
  e.target.textContent = UIText.terminateBtn;
  resetGameNumbers();
  startNewRound();
};

const setNewMatrix = () => {
  trial += 1;
  if (hasError) {
    // make game easier
    // decrease the max among (row, col, tiles)
    // until they get the lowest limit
    if (tiles > matrixCol) {
      tiles -= 1;
    } else if (matrixCol > matrixRow) {
      matrixCol -= 1;
    } else if (matrixRow > GameConfig.minRow) {
      matrixRow -= 1;
    } else if (tiles > 1) {
      tiles -= 1;
    }
  } else {
    // make game harder
    // alway increase colum first, so row will alway be
    // less than or equal to column.
    // and their difference should not be greater than 1
    if (tiles < matrixRow + 1) {
      tiles += 1;
    } else if (matrixRow < matrixCol) {
      matrixRow += 1;
    } else if (matrixCol < GameConfig.maxColumn) {
      matrixCol += 1;
    } else if (tiles < GameConfig.maxTiles) {
      tiles += 1;
    }
  }

  hasError = false;
  clickCount = tiles;
  updateScore(score);
  updateTiles(tiles);
  updateTrial(trial);
};

const startNewRound = () => {
  // update rows, and columns, tiles, clickCount, hasError
  setNewMatrix();

  // create new matrix
  createMatrix(matrixRow, matrixCol);

  // reset selected cards and set flip effect
  reSetTiles();

  // rotate matrix
  rotateMatrix();
};

document
  .getElementById("terminate-btn")
  .addEventListener("click", terminateGame);

window.onload = () => {
  startNewRound();
};
