const board = document.getElementById("board");
const restartBtn = document.getElementById("restart-btn");
const startBtn = document.getElementById("start-btn");
const playForm = document.getElementById("play-form");
const endBtn = document.getElementById("end-btn");
const result = document.getElementById("result");

const styles = getComputedStyle(document.body);
const blueWinnerIndicator = styles.getPropertyValue('--BLUE-WINNING-BLOCKS');
const redWinnerIndicator = styles.getPropertyValue('--RED-WINNING-BLOCKS');
const playerOneColor = styles.getPropertyValue('--PLAYER-ONE-COLOR');
const playerTwoColor = styles.getPropertyValue('--PLAYER-TWO-COLOR');
const drawColor = styles.getPropertyValue('--DRAW-COLOR');

document.addEventListener("DOMContentLoaded", () => {
    playForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const name1Input = document.getElementById("name1");
        const name2Input = document.getElementById("name2");
        const names = [name1Input.value, name2Input.value];
        localStorage.setItem("names", JSON.stringify(names));
        window.location.href = "game.html";
    });
});

const names = JSON.parse(localStorage.getItem("names"));
const [playerOneName, playerTwoName] = names;
const playerOne = "X";
const playerTwo = "O";
let currentPlayer = playerOne;
const array = Array(9).fill(null);
const cells = Array.from(document.getElementsByClassName("cell"));

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

const audio = new Audio("the-epic-2-by-rafael-krux(chosic.com).mp3");
const audioWin = new Audio('WhatsApp Audio 2024-05-18 at 14.10.51_5b80a3ab.mp3');

const stopAudio = (audioElement) => {
    audioElement.pause();
    audioElement.currentTime = 0;
};

const startGame = () => {
    cells.forEach(cell => cell.addEventListener("click", cellClicked));
    audio.autoplay = true;
    audio.loop = true;
    audio.play();
    result.textContent = `${playerOneName}'s turn`;
};

const stopGame = () => {
    cells.forEach(cell => cell.removeEventListener("click", cellClicked));
};

const cellClicked = (e) => {
    const id = Number(e.target.id);

    if (!array[id]) {
        array[id] = currentPlayer;
        e.target.textContent = currentPlayer;
        e.target.style.animation = currentPlayer === playerOne ? playerOneColor : playerTwoColor;

        const winningBlocks = playerHasWon();

        if (winningBlocks) {
            const winner = currentPlayer === playerOne ? playerOneName : playerTwoName;
            result.textContent = `${winner} has won!`;
            winningBlocks.forEach(block => cells[block].style.backgroundColor = currentPlayer === playerOne ? blueWinnerIndicator : redWinnerIndicator);
            stopAudio(audio);
            audioWin.play();
            stopGame();
            return;
        }

        currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
        const player = currentPlayer === playerOne ? playerOneName : playerTwoName;
        result.textContent = `${player}'s turn`;
        result.style.animation = currentPlayer === playerOne ? playerOneColor : playerTwoColor;

        checkDraw();
    }
};

const restart = () => {
    array.fill(null);
    cells.forEach(cell => {
        cell.textContent = "";
        cell.style.backgroundColor = "";
    });
    result.textContent = `${playerOneName}'s turn`;
    result.style.animation = playerOneColor;
    currentPlayer = playerOne;
    stopGame();
    startGame();
};

const playerHasWon = () => {
    for (const condition of winningConditions) {
        const [a, b, c] = condition;
        if (array[a] && array[a] === array[b] && array[a] === array[c]) {
            return [a, b, c];
        }
    }
    return null;
};

const checkDraw = () => {
    if (!array.includes(null)) {
        result.textContent = "Draw!!";
        result.style.animation = drawColor;
        stopAudio(audio);
        stopAudio(audioWin);
        stopGame();
    }
};

const end = () => {
    stopAudio(audio);
    stopAudio(audioWin);
    stopGame();
    window.location.href = "index.html";
    localStorage.clear();
};

startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", restart);
endBtn.addEventListener("click", end);

