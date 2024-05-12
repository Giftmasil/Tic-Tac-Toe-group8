const board = document.getElementById("board")
const restartBtn = document.getElementById("restart-btn")
const startBtn = document.getElementById("start-btn")
const playForm = document.getElementById("play-form");
const endBtn = document.getElementById("end-btn")
const result = document.getElementById("result")
const blueWinnerIndicator = getComputedStyle(document.body).getPropertyValue('--BLUE-WINNING-BLOCKS')
const redWinnerIndicator = getComputedStyle(document.body).getPropertyValue('--RED-WINNING-BLOCKS')
const playerOneColor = getComputedStyle(document.body).getPropertyValue('--PLAYER-ONE-COLOR')
const playerTwoColor = getComputedStyle(document.body).getPropertyValue('--PLAYER-TWO-COLOR')
const drawColor = getComputedStyle(document.body).getPropertyValue('--DRAW-COLOR')

document.addEventListener("DOMContentLoaded", function() {
    // Your script code here
    // Attach event listener to the form
    playForm.addEventListener("submit", function(event) {
        // Prevent the form from submitting
        event.preventDefault();
        let name1Input = document.getElementById("name1");
        let name2Input = document.getElementById("name2");
        const names = [name1Input.value, name2Input.value];
        localStorage.setItem("names", JSON.stringify(names));
        window.location.href = "game.html";
    });
});

let names = JSON.parse(localStorage.getItem("names"))

let playerOneName = names[0]
let playerTwoName = names[1]

const playerOne = "X"
const playerTwo = "O"

let currentPlayer = playerOne

let array = Array(9).fill(null)
let cells = Array.from(document.getElementsByClassName("cell"))

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]

function startGame() {
    for (let i = 0; i < cells.length; i++) {
        cells[i].addEventListener("click", cellClicked)
    }
    result.textContent = `${playerOneName}'s turn`
}

function stopGame() {
    for (let i = 0; i < cells.length; i++) {
        cells[i].removeEventListener("click", cellClicked);
    }
}

function cellClicked(e) {
    const id = Number(e.target.id)

    if (!array[id]) {
        array[id] = currentPlayer
        e.target.textContent = currentPlayer

        e.target.style.animation = currentPlayer === playerOne? playerOneColor : playerTwoColor;

        const winningBlocks = playerHasWon()

        if (winningBlocks) {
            const winner = currentPlayer === playerOne? playerOneName : playerTwoName;
            result.textContent = `${winner} has won!`
            winningBlocks.map(block => cells[block].style.backgroundColor= currentPlayer === playerOne? blueWinnerIndicator: redWinnerIndicator)
            
            
            stopGame()
            return;
        } else {
            currentPlayer = (currentPlayer === playerOne)? playerTwo : playerOne;
            let player = currentPlayer === playerOne? playerOneName : playerTwoName;
            result.textContent = `${player}'s turn`

            result.style.animation = currentPlayer === playerOne? playerOneColor : playerTwoColor;

            draw()
        }    
    }
}

function restart() {
    array.fill(null)

    cells.forEach(cell => {
        cell.textContent = ""
        cell.style.backgroundColor = ""
        result.textContent = ""
    })
    currentPlayer = playerOne
    result.style.animation = playerOneColor
    stopGame()
    startGame()
}

function playerHasWon()  {
    for (let i = 0; i < winningConditions.length; i++) {
        const condition = winningConditions[i]
        const a = condition[0]
        const b = condition[1]
        const c = condition[2]

        if (array[a] && array[a] === array[b] && array[a] === array[c]) {
            return [a, b, c]
        }
    }
    return null
}

function draw() {
    if (!array.includes(null)) {
        result.textContent = "Draw!!"

        result.style.animation = drawColor

        stopGame()
    } 
}

function end() {
    stopGame()
    window.location.href = "index.html";
    localStorage.clear()
    name1Input.value = ""
    name2Input.value = ""
}

startBtn.addEventListener("click", startGame)
restartBtn.addEventListener("click", restart)
endBtn.addEventListener("click", end)