let testButton = document.querySelector("#testButton");
let quoteTable = document.querySelector(".quoteTable");
let userInputDiv = document.querySelector(".textBox");
let countDownTimer = document.querySelector(".countDownTimer");

let quote = "";
let quoteArr = [];

let startTime = 0;//the start time of the game
let totalWords = 0;//the total number of "words" (totalchars / 5) in the quote
let wpm = 0;//the final wpm of the user

testButton.addEventListener("click", async () => {
    getQuote();
    startGameCountdown();
    setTimeout(()=>{
        displayQuoteTable();
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
 * Sets the html to display the quote and splits the quote into an array of characters.
 * this function displays the quote as just the quote. This makes the game more difficult
 * as the user cannot track their position in the quote as easily.
 */
function displayGameQuote(){
    quoteArr = quote.split("");
    let running = true;
    let counter = 0;
    let charsPerRow = 60;
    while (running){
        let quoteRow = document.createElement('tr');
        for (counter; counter < charsPerRow; counter++){
            if (counter == quoteArr.length){
                running = false;
            }
            if (counter < quoteArr.length){
                let quoteChar = document.createElement('td');
                quoteChar.class = "notCompleted";
                quoteChar.id = "char"+counter;
                quoteChar.innerHTML = quoteArr[counter];
                quoteRow.appendChild(quoteChar);
            }
        }
        quoteTable.appendChild(quoteRow);
        charsPerRow += 60;
    }
    let userInputText = document.createElement('input');
    userInputText.type = "text";
    userInputText.maxLength = 0;
    userInputText.id = "userInputText";
    userInputDiv.appendChild(userInputText);
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
                let prevChar = currentCharInd;
                currentCharInd++;
                let idStr = "char" + prevChar;
                let charNode = document.getElementById(idStr);//grab the character we are on from the table
                charNode.style.backgroundColor = '#20b2aa';
                charNode.style.border = '1px solid lightseagreen';
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

/**
 * function that displays the count down to start the game when user clicks button
 */
function startGameCountdown() {
    for (let i = 5; i > 0; i--){
        setTimeout(()=>{
            if (5-i != 0){
                countDownTimer.innerHTML = 5 - i;
            }
            else{
                countDownTimer.innerHTML = "Start";
            }
        },1000 * i);
    }
}

/**
 * this function displays the quote to the screen formatted in a table. This allows for styles to be
 * more easily applied to individual characters so that users can track their position easier.
 * The table has around 60 characters per row and creates new rows after spaces from the previous word.
 */
function displayQuoteTable () {
    quoteArr = quote.split("");
    let currentChar = 0;
    let maxCharsPerRow = 60;
    let createNewRow = false;
    
    while (currentChar < quoteArr.length){//while we are building the table for the quote
        let quoteRow = document.createElement('tr');
        createNewRow = false;//boolean to check whether we it time for a new row

        while (createNewRow == false && currentChar < quoteArr.length){//start building the table
            if (currentChar > maxCharsPerRow-10 && quoteArr[currentChar-1] === " "){//if we are over 50 characters in the row and on a space
                createNewRow = true;//its time to create a new row
            }
            else{//otherwise we are staying on that same row
                if (currentChar < quoteArr.length){
                    let quoteChar = document.createElement('td');//create the data element for the char
                    quoteChar.class = "notCompleted";//set the class to not completed
                    quoteChar.id = "char"+currentChar;//set a unique id to the character that is the number character it is in the quote
                    quoteChar.innerHTML = quoteArr[currentChar];//set the inner html to the char
                    currentChar++;
                    quoteRow.appendChild(quoteChar);//append to the row
                }
            }
        } //when we finish a new row
        quoteTable.appendChild(quoteRow);//append row to the table
        maxCharsPerRow += 60;//add another 60 to the max chars per row so the next row handles next 60 ish chars
    }

    let userInputText = document.createElement('input');
    userInputText.type = "text";
    userInputText.maxLength = 0;
    userInputText.id = "userInputText";
    userInputDiv.appendChild(userInputText);
}