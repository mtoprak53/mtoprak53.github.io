const gameContainer = document.getElementById("game");

const COLORS = ["red", "blue", "green", "orange", "purple", "red", "blue", "green", "orange", "purple"];

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }
  return array;
}

let shuffledColors = shuffle(COLORS);

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {

  // clears sessionStorage before each game
  sessionStorage.clear();

  for (let color of colorArray) {

    // create a new div
    const newDiv = document.createElement("div");

    // give it a class attribute for the value we are looping over
    newDiv.classList.add(color);

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }
}

// TODO: Implement this function!
function handleCardClick(event) {

  if (
    // if there are two flipped cards
    (sessionStorage.clicks && parseInt(sessionStorage.clicks) > 1)
    || event.target.classList.contains('flipped')   // or an already flipped
    || event.target.classList.contains('matched')   // or a matched card
    ) {return}   //  is clicked, quit the function
  
  // flipped card counter
  if (sessionStorage.clicks) {
    sessionStorage.clicks++;
  } else {
  sessionStorage.clicks = 1;
  }

  // you can use event.target to see which element was clicked
  console.log("you just clicked", event.target);
  
  let matchedColors = [];   // array for already matched colors  
  if (sessionStorage.matchedColors) {
    matchedColors = JSON.parse(sessionStorage.matchedColors);
  }   // saving matched colors array on sessionStorage

  // make div bg-color same with its class name
  const color = event.target.getAttribute('class');
  event.target.style.backgroundColor = color;

  // we add our 'flipped' marker to the class list of the element
  event.target.classList.add('flipped');

  // if there is another flipped card earlier:
  if (sessionStorage.flippedCard) {

    // if this card matches with the earlier flipped card ...
    if (color === sessionStorage.flippedCard) {

      // change the 'flipped' marker on the class lists with 'matched' marker
      const allCards = document.querySelectorAll('div > div');
      for (card of allCards) {
        if (card.classList.contains('flipped')) {
          card.classList.remove('flipped');
          card.classList.add('matched');
        }
      }

      // ... add the color to matchedColors array
      matchedColors.push(color);

      // reset the flag and the counter
      sessionStorage.flippedCard = '';
      sessionStorage.clicks = 0;
    
    } else {   // if the two flipped cards do not match ...

      // ... keep them flipped 1 sec & flip back both of them
      setTimeout(function() {
        const allCards = document.querySelectorAll('div > div');
        for (card of allCards) {
          if (card.classList.contains('flipped')) {
            card.classList.remove('flipped');   // remove 'flipped' markers
          }
          if (!matchedColors.includes(card.style.backgroundColor)) {
            card.style.backgroundColor = '';   // remove bg-colors
          }
        }
        // reset the counter
        sessionStorage.clicks = 0;
      }, 1000);
      // reset the flag
      sessionStorage.flippedCard = '';
    }

    // if there is NO other flipped card earlier:
  } else {
    sessionStorage.flippedCard = color;
  }

  // save matched colors array on sessionStorage
  const matchedColorsJson = JSON.stringify(matchedColors);
  sessionStorage.setItem('matchedColors', matchedColorsJson);

  // *** TESTS ***
  console.log(sessionStorage);  
}

// when the DOM loads
createDivsForColors(shuffledColors);