const gameContainer = document.querySelector(".game-container");
const movesText = document.getElementById("moves");
const timeText = document.getElementById("time");
const restartBtn = document.getElementById("restart");
const message = document.getElementById("message");

// Card symbols
const cardsArray = ["🍎", "🍌", "🍇", "🍒", "🍎", "🍌", "🍇", "🍒"];

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let matchedPairs = 0;
let time = 0;
let timer;

// Shuffle cards
function shuffleCards() {
  return cardsArray.sort(() => 0.5 - Math.random());
}

// Start timer
function startTimer() {
  timer = setInterval(() => {
    time++;
    timeText.textContent = time;
  }, 1000);
}

// Create cards
function createBoard() {
  gameContainer.innerHTML = "";
  shuffleCards().forEach(symbol => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front"></div>
        <div class="card-back">${symbol}</div>
      </div>
    `;

    card.addEventListener("click", () => flipCard(card));
    gameContainer.appendChild(card);
  });
}

// Flip logic
function flipCard(card) {
  if (lockBoard || card === firstCard || card.classList.contains("matched")) return;

  if (moves === 0 && !timer) startTimer();

  card.classList.add("flip");

  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;
  moves++;
  movesText.textContent = moves;
  lockBoard = true;

  checkMatch();
}

// Match check
function checkMatch() {
  const isMatch =
    firstCard.querySelector(".card-back").textContent ===
    secondCard.querySelector(".card-back").textContent;

  isMatch ? disableCards() : unflipCards();
}

// When matched
function disableCards() {
  firstCard.classList.add("matched");
  secondCard.classList.add("matched");
  matchedPairs++;

  if (matchedPairs === cardsArray.length / 2) {
    clearInterval(timer);
    message.textContent = `🎉 You Won in ${moves} moves and ${time} seconds!`;
  }

  resetBoard();
}

// When not matched
function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove("flip");
    secondCard.classList.remove("flip");
    resetBoard();
  }, 1000);
}

// Reset turn
function resetBoard() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

// Restart game
restartBtn.addEventListener("click", () => {
  clearInterval(timer);
  timer = null;
  time = 0;
  moves = 0;
  matchedPairs = 0;
  message.textContent = "";
  timeText.textContent = 0;
  movesText.textContent = 0;
  resetBoard();
  createBoard();
});

// Init
createBoard();
