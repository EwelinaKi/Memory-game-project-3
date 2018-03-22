var startTime, endTime;

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

    const elementOnDeck = Array.from(document.getElementsByClassName("card"));
    let id = 0
    elementOnDeck.forEach(element => {
        element.classList.add("down");
        element.childNodes[1].setAttribute("class", "fa");
        element.childNodes[1].classList.add(array[id]);
        id++
    });
}

function sumValues(map) {
    let sum = 0;
    for (let [key, value] of map) {
        sum = sum + map.get(key)
    }
    return sum;
}

function restartGame() {
    //shuffle array and put new cards on deck
    shuffle(cardsArray);
    putCardsOnDeckFromShuffled(cardsArray);
    //reset all values in cardsMAP
    for (let [key] of cardsMap) {
        cardsMap.set(key, 0);
    }
    //reset numbers of moves
    moves = 0;
    checkMove = 0;
    //hide all cards
    const listOfCards = Array.from($(".card"));
    listOfCards.forEach(resetAllCards);
    //reset stars
    document.getElementById("moves").innerHTML = moves;
    document.getElementById("star1").setAttribute("class", "fa fa-star");
    document.getElementById("star2").setAttribute("class", "fa fa-star");
    document.getElementById("star3").setAttribute("class", "fa fa-star");
    //set new timer
    startTime = new Date();

    // Update the count down every 1 second
    var x = setInterval(function () {
        // Get actual time
        const now = new Date().getTime();
        // Find the distance between start game and now
        const distance = now - startTime;
        // Time calculations for days, hours, minutes and seconds
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        // Output the result
        document.getElementById("timer").innerHTML = minutes + ":" + seconds;
    }, 1000);
    return x
}

function hideCards(element, index, array) {
    if (element.classList.contains("up")) {
        element.setAttribute("class", "card down");
    }
}

function resetAllCards(element, index, array) {
    if (element.classList.contains("up") || element.classList.contains("match")) {
        element.setAttribute("class", "card down");
    }
}

function updateScore(moves) {
    document.getElementById("moves").innerHTML = moves;
    if (moves === 16) {
        document.getElementById("star1").setAttribute("class", "far fa-star");
    } else if (moves === 22) {
        document.getElementById("star2").setAttribute("class", "far fa-star");
    } else if (moves === 30) {
        document.getElementById("star3").setAttribute("class", "far fa-star");
    }
}

function displayModal(moves) {
    endTime = new Date();
    const fullStarsCount = Array.from(document.getElementsByClassName("fa fa-star")).length
    const emptyStarsCount = Array.from(document.getElementsByClassName("far fa-star")).length
    const totalTime = (endTime - startTime) / 60000;
    document.getElementById("text").innerHTML = ("You earned " + "★".repeat(fullStarsCount) + "☆".repeat(emptyStarsCount) + "  with " + moves + " moves" + " in " + totalTime.toFixed(2) + " minutes.");
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
            if (checkMove === 0) {
                card.setAttribute("class", "card up");
                cardsMap.set(cardKey, tempValue + 10);
                checkMove++;
                // if second round
            } else if (checkMove === 1) {
                card.setAttribute("class", "card up");
                cardsMap.set(cardKey, tempValue + 10);
                checkMove++;
                totalMove++;
                updateScore(totalMove);
                //clear cardsMap for unmached cards
                for (let [key] of cardsMap) {
                    if (cardsMap.get(key) === 10) {
                        cardsMap.set(key, 0)
                    }
                }
                if (cardsMap.get(cardKey) === 20) {
                    // if pair has been exposes change its style and immediately go to next move
                    checkMove = 0;
                    Array.from(document.getElementsByClassName(cardKey))[0].parentElement.setAttribute("class", "card match")
                    Array.from(document.getElementsByClassName(cardKey))[1].parentElement.setAttribute("class", "card match")
                }
            }
            //if "third round" = hides unmatched cards
            else if (checkMove === 2) {
                checkMove = 0;
                //check the winnings
                let sumOut = sumValues(cardsMap)
                if (sumOut >= 0) {
                    // if (sumOut === 160) {
                    displayModal(totalMove)
                }
                //hide cards
                const listOfCards = Array.from($(".card"));
                listOfCards.forEach(hideCards);
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

//the variable which counts rounds per move
let checkMove = 0;

//the variable which counts all rounds made by player
let totalMove = 0;

// Get the <span> element that closes the modal
let span = document.getElementsByClassName("close")[0];

// Get the modal
let modal = document.getElementById('myModal');

//add events listeners:
restartGame();
$(".restart").click(restartGame);

const card = $(".card");
card.click(playerMove);

span.onclick = function () {
    modal.style.display = "none";
}
