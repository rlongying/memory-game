import { getRndIntegers } from "./util.js";

// matrix dimension, min 5x5
let matrixRow = 5;
let matrixCol = 5;

// number of tiles, initial value 5
let tiles = 5;

// how many tiles have been clicked
let clickCount = tiles;
let hasError = false; // has chosen wrong cards

const playSound = soundId => {
  let audio = document.getElementById(soundId);
  audio.currentTime = 0;
  audio.play();
};

let checkCard = event => {
  let card = event.target;
  let hasSelected = card.dataset.selected;

  if (hasSelected === "true") {
    // click correct card
    if (!hasError && clickCount === 1) {
      // correct card and is the last card
      card.classList.add("success-card");
      playSound("last-card-success-sound");
    } else {
      // not last card
      card.classList.add("flip-card-single");
      playSound("flip-card-success-sound");
    }
  } else {
    // clicked wrong card
    hasError = true;
    card.classList.add("error-card");
    playSound("flip-card-error-sound");
  }

  clickCount--;

  // no more clicks allowed
  if (clickCount == 0) {
    flipMissedCards();
    setTimeout(() => {
      if (!hasError) {
        playSound("new-game-success-sound");
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

const startNewRound = () => {
  // update rows, and columns, tiles, clickCount, hasError

  hasError = false;
  clickCount = tiles;
  // create new matrix
  createMatrix(matrixRow, matrixCol);

  // reset selected cards and set flip effect
  reSetTiles();

  // rotate matrix
  rotateMatrix();
};

window.onload = () => {
  startNewRound();
};
