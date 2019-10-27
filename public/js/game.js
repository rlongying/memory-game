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
    card.classList.add("flip-card-single");
    if (!hasError && clickCount === 1) {
      playSound("last-card-success-sound");
      setTimeout(() => {
        playSound("new-game-success-sound");
      }, 1000);
      startNewRound();
    } else {
      playSound("flip-card-error-sound");
    }
  } else {
  }
  clickCount--;
  card.removeEventListener("click", checkCard);
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

const createMatrix = (row, col) => {
  // get container
  let gameContainer = document.getElementById("game-container");

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

      let span = document.createElement("span");
      rowDiv.appendChild(span);

      rowDiv.appendChild(tileDiv);
    }
    gameContainer.appendChild(rowDiv);
  }
};

const rotateMatrix = () => {
  let container = document.getElementById("game-container");

  // remove rotate class in case it exist
  container.classList.remove("rotate-matrix");

  // add rotate class
  container.classList.add("rotate-matrix");
};

const startNewRound = () => {
  // update rows, and columns

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
