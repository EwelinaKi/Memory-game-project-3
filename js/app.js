const TWO_STARS = 20;
const ONE_STAR = 29;
const WINNER = 160;
const CARD_UP = 10;
const PAIR_MATCHED = 20;
const FIRST_CARD_UP = 0;
const SECOND_CARD_UP = 1;

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length,
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
    const elementsOnDeck = Array.from(document.getElementsByClassName("card"));
    elementsOnDeck.forEach((element, index) => {
        element.classList.add("down");
        element.childNodes[1].setAttribute("class", "fa");
        element.childNodes[1].classList.add(array[index]);
    });
}

function sumValues(map) {
    return Array.from(map.values()).reduce((a, b) => a + b);
}

function restartGame() {
    modal.style.display = "none";
    //reset numbers of moves
    moves = 0;
    checkMove = FIRST_CARD_UP;
    totalMove = 0;
    //reset all values in cardsMap
    cardsMap.forEach((v, k, m) => m.set(k, 0));
    //reset stars
    document.getElementById("moves").innerHTML = moves;
    document.getElementById("star1").setAttribute("class", "fa fa-star");
    document.getElementById("star2").setAttribute("class", "fa fa-star");
    document.getElementById("star3").setAttribute("class", "fa fa-star");
    //shuffle cards and puts them on deck
    shuffle(cardsArray);
    putCardsOnDeckFromShuffled(cardsArray);
    //hide all cards
    const listOfCards = Array.from($(".card"));
    listOfCards.forEach(v => v.setAttribute("class", "card down"));
    //set new timer
    startTime = new Date();
    counter = setInterval(function () {
        // Get actual time
        const now = new Date().getTime();
        // Find the distance between start game and now
        const distance = now - startTime;
        // Time calculations for days, hours, minutes and seconds
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = formatToTwoDigits(Math.floor((distance % (1000 * 60)) / 1000));
        // Output the result
        document.getElementById("timer").innerHTML = minutes + ":" + seconds;
    }, 1000);
}

function formatToTwoDigits(numberToBeFormatted) {
    return numberToBeFormatted.toLocaleString(undefined, {
        minimumIntegerDigits: 2
    });
}

function updateScore(moves) {
    let starFull = "★★★";
    let starEmpty = "";
    if (moves > TWO_STARS && moves <= ONE_STAR) {
        document.getElementById("star1").setAttribute("class", "far fa-star");
        starFull = "★★";
        starEmpty = "☆";
    } else if (moves > ONE_STAR) {
        document.getElementById("star2").setAttribute("class", "far fa-star");
        starFull = "★"
        starEmpty = "☆☆";
    
    } return {
        stars1: starFull,
        stars2: starEmpty
    }
}

function displayModal(moves, stars) {
    // stop counter
    clearInterval(counter);
    endTime = new Date();
    const totalTime = (endTime - startTime);
    const minutes = Math.floor((totalTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = formatToTwoDigits(Math.floor((totalTime % (1000 * 60)) / 1000));
    summaryText = `<p class="winnerStars">${stars.stars1}${stars.stars2}</p>
    <p class="winnerStats">${moves} Moves</p>
    <p class="winnerStats">Total time ${minutes}:${seconds}</p>`
    document.getElementById("text").innerHTML = (summaryText)
    modal.style.display = "block";
}

function playerMove(event) {
    let card = event.target;
    //prevent click on picture
    if (event.target.classList.contains("card")) {
        //prevent action on card which is up
        if (event.target.classList.contains("down")) {
            //check round if chcekMove===1 then player can up one more card
            const cardKey = card.firstElementChild.classList.value;
            let tempValue = cardsMap.get(cardKey);
            //if first round
            if (checkMove === FIRST_CARD_UP) {
                card.setAttribute("class", "card up");
                cardsMap.set(cardKey, tempValue + CARD_UP);
                checkMove++;
                // if second round
            } else if (checkMove === SECOND_CARD_UP) {
                card.setAttribute("class", "card up");
                cardsMap.set(cardKey, tempValue + CARD_UP);
                checkMove++;
                totalMove++;
                document.getElementById("moves").innerHTML = totalMove;
                stars = updateScore(totalMove);
                //clear cardsMap for unmached cards  
                cardsMap.forEach((v, k, m) => {
                    if (m.get(k) === CARD_UP) {
                        m.set(k, 0);
                    }
                });
                if (cardsMap.get(cardKey) === PAIR_MATCHED) {
                    // if pair has been exposes change its style and immediately go to next move
                    checkMove = 0;
                    Array.from(document.getElementsByClassName(cardKey))[0].parentElement.setAttribute("class", "card match")
                    Array.from(document.getElementsByClassName(cardKey))[1].parentElement.setAttribute("class", "card match")
                    //check the winnings
                    let sumOut = sumValues(cardsMap)
                    if (sumOut >= WINNER) {
                        displayModal(totalMove, stars)
                    }
                } else {
                    setTimeout(() => {
                        checkMove = FIRST_CARD_UP;
                        //hide cards
                        const listOfCards = Array.from($(".card"));
                        listOfCards.forEach((v, i, a) => {
                            if (v.classList.contains("up")) {
                                v.setAttribute("class", "card down");
                            }
                        });
                    }, 1500);
                }
            }
        }
    }
}

// prepare array of card classes to shuffle
let cardsArray = ["fa-futbol-o", "fa-futbol-o", "fa-home", "fa-home", "fa-rocket", "fa-rocket", "fa-truck", "fa-truck", "fa-leaf", "fa-leaf",
    "fa-puzzle-piece", "fa-puzzle-piece", "fa-binoculars", "fa-binoculars", "fa-birthday-cake", "fa-birthday-cake"
];

// caḍrsMap for tracking changes on dock for pair of cards: 0 - all cards down, 10 - one card's up, 20 - two cards up = match
let cardsMap = new Map([
    ["fa fa-futbol-o", 0],
    ["fa fa-home", 0],
    ["fa fa-rocket", 0],
    ["fa fa-truck", 0],
    ["fa fa-leaf", 0],
    ["fa fa-puzzle-piece", 0],
    ["fa fa-binoculars", 0],
    ["fa fa-birthday-cake", 0]
]);

//timer
let counter;

//variable which counts rounds per move
let checkMove = 0;

//variable which counts all rounds made by player
let totalMove = 0;

const closeModal = document.getElementsByClassName("close")[0];
const modal = document.getElementById('victory');

restartGame();

//add events listeners:
$(".restart").click(restartGame);
$(".card").click(playerMove);
$(".close").click(() => modal.style.display = "none");
$("#again").click(restartGame);