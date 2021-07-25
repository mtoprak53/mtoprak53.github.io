// HTML ELEMENTS
const cardsDiv = document.getElementById("drawn-card");
const cardsLeft = document.getElementById("left-cards");
const bttn = document.querySelector("button");

// VARIABLES
const URL = "https://deckofcardsapi.com/api/deck";
let deckId = null;
let remaining = 52;
cardsLeft.innerText = remaining;

// FUNCTIONS

// decks  ->  # of decks shuffled (number)
function shuffleCards(decks=1) {
  return axios.get(`${URL}/new/shuffle/?deck_count=${decks}`)
}

// cards  ->  # of cards drawn (number)
function drawCards(cards=1) {
  return axios.get(`${URL}/${deckId}/draw/?count=${cards}`)
}

function buildHtml(res) {
  // CONSOLE LOGS
  console.log(res.data);
  const card = res.data.cards[0];
  const cardName = `${card.value} of ${card.suit}`;
  console.log(cardName);

  // CARD IMAGE
  const newImg = document.createElement("img");
  newImg.setAttribute("src", `${card.image}`);
  const tilt = (Math.random() * 90) - 45;
  newImg.style.transform = `rotate(${tilt}deg)`;
  cardsDiv.append(newImg);

  // REMAINING CARD COUNTER
  remaining = res.data.remaining;
  cardsLeft.innerText = remaining;
}

function cardDraw() {
  // AFTER THE FIRST CARD DRAWN
  if (deckId || remaining < 52) {
    drawCards(cards=1)
      .then(res => buildHtml(res))
      .catch(err => console.log(err))

  } else {
    // FIRST CARD OF THE DECK
    shuffleCards(decks=1)
      .then(res => {
        deckId = res.data.deck_id;
        return drawCards(cards=1)
      })
      .then(res => buildHtml(res))
      .catch(err => console.log(err))
  }
}

// EVENTLISTENER FOR THE BUTTON
bttn.addEventListener("click", cardDraw);
