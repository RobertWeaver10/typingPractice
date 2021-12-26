let testButton = document.querySelector("#testButton");
let quoteArea = document.querySelector(".randomQuote");
let userInputDiv = document.querySelector(".textBox");

let quote = "";
let quoteArr = [];

let startTime = 0;//the start time of the game
let totalWords = 0;//the total number of "words" (totalchars / 5) in the quote
let wpm = 0;//the final wpm of the user

testButton.addEventListener("click", async () => {
    getQuote();
    setTimeout(()=>{
        displayGameQuote();
        setTotalWords();
    }, 1000);
    setTimeout(()=>{
        startTypingPractice();
    }, 5000);
});

/**
 * ansynchronous function that fetches a random quote of length 250 characters
 * from quotable free api. The promis object is opened in the first then() and the json
 * is extracted. Then the second then() saves the content from the json object.
 */
async function getQuote(){
    await fetch("https://api.quotable.io/random?minLength=250")
        .then(res => res.json())
        .then(data =>
            quote = data.content
        );
}

/**
 * Sets the html to display the quote and splits the quote into an array of characters
 */
function displayGameQuote(){
    quoteArea.innerHTML = quote;
    let userInputText = document.createElement('input');
    userInputText.type = "text";
    userInputText.maxLength = 0;
    userInputText.id = "userInputText";
    userInputDiv.appendChild(userInputText);
    quoteArr = quote.split("");
}

/**
 * uses the array representation of the quote and checks that each keystroke of the user's
 * matches the quote. use a counter to move through the indicies of array updating the 
 * counter only if the user's keyboard input matched the current letter
 */
function startTypingPractice() {
    let gameTextBox = document.getElementById("userInputText");
    gameTextBox.maxLength = 500;                        //allow user to type in input field
    startTime = Date.now();                             //get the time the user started the game
    let currentCharInd = 0;
    gameTextBox.addEventListener('input', (event) => {
        if (quoteArr[currentCharInd] === event.data){   //if the current char is equal to the input
            if (currentCharInd < quoteArr.length-1){    //if we are not on the last char
                currentCharInd++;                       //update the index
            }
            else{                                       //we are on the last char so we won the game
                calculateWpm();                         //calculate user's wpm
                alert("wpm: " + wpm);                   //alert user their speed
                location.reload();                      //reload the page
            }
        }
        else{                                           //the current char is not equal to the input so they made a typo
            alert("You made a typo");                   //alert user they messed up
            location.reload();                          //reload page
        }
    });
}

/**
 * function that gets sets the total num of chars to calculate statistics upon completion of quote
 * when calculating wpm for typing a "word" is any group of 5 characters typed
 */
function setTotalWords () {
    totalWords = Math.floor((quoteArr.length -1)/5);
}

/**
 * function that tracks the total time passed and uses it to calculate the user's wpm
 */
function calculateWpm () {
    finishTime = Date.now();
    let totalTimeMin = ((finishTime - startTime)/1000)/60;
    wpm = totalWords / totalTimeMin;
}