import { getRndIntegers } from "./util.js";
import { InitialValue, Audio } from "./constatns.js";

// matrix dimension, min 5x5
let matrixRow = InitialValue.row;
let matrixCol = InitialValue.column;

// number of tiles, initial value 5
let tiles = InitialValue.tiles;
let trial = InitialValue.trial;
let score = InitialValue.score;

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
  updateTrial(InitialValue.trial);
  updateTiles(InitialValue.tiles);
  updateScore(InitialValue.score);
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

  // no more clicks allowed
  if (clickCount == 0) {
    flipMissedCards();
    setTimeout(() => {
      if (!hasError) {
        playSound(Audio.newGameSuccess);
      }
      startNewRound();
    }, 2000);
  }
  card.removeEventListener("click", checkCard);
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

const terminateGame = () => {
  if (confirm("Are you sure to terminate the game?")) {
    // yes
    console.log("confirm termination");
    resetGameNumbers();
  }
  // cancel do nothing
};

const setNewMatrix = () => {
  if (hasError) {
  }
  hasError = false;
  clickCount = tiles;
};

const startNewRound = () => {
  // update rows, and columns, tiles, clickCount, hasError
  setNewMatrix();

  // display game infos
  resetGameNumbers();
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
