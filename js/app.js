// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

function putCardsOnDeckFromShuffled(array) {

    const elementOnDeck = Array.from(document.getElementsByClassName("card"));
    let id = 0
    elementOnDeck.forEach(element => {
        element.classList.add("match"); //in future change it to "card down" to hide picture
        element.childNodes[1].setAttribute("class", "fa");
        element.childNodes[1].classList.add(array[id]);
        id++
    });
}



function restartGame() {
    shuffle(cardsArray);
    putCardsOnDeckFromShuffled(cardsArray);
}

// prepare array of card classes to shuffle
cardsArray = ["fa-futbol-o", "fa-futbol-o", "fa-home", "fa-home", "fa-rocket", "fa-rocket", "fa-truck", "fa-truck", "fa-leaf", "fa-leaf",
    "fa-puzzle-piece", "fa-puzzle-piece", "fa-binoculars", "fa-binoculars", "fa-birthday-cake", "fa-birthday-cake"
];

// caḍrsMap for tracking changes on dock for pair of cards: 0 - all cards down, 10 - one card's up, 20 - two cards up = match
cardsMap = {
    "fa-futbol-o": 0,
    "fa-home": 0,
    "fa-rocket": 0,
    "fa-truck": 0,
    "fa-leaf": 0,
    "fa-puzzle-piece": 0,
    "fa-binoculars": 0,
    "fa-birthday-cake": 0
};

//add events listeners
$(".restart").click(restartGame);

console.log($(".restart"));
console.log(document.getElementsByClassName("restart"));
console.log($(".card"));

// $(".card").addClass("dupa");




restartGame();





/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
