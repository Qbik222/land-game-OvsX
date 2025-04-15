const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const restartBtn = document.getElementById('restart');
const overlay = document.querySelector(".overlay");
const sideBtns = document.querySelectorAll('.side-btn');
const gameContainer = document.getElementById('game');


let board = ['', '', '', '', '', '', '', '', ''];
let isComputerX = true; // Чередує роль комп'ютера між X та O
let currentPlayer, computerPlayer;

const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

function initializeGame() {
    currentPlayer = isComputerX ? 'O' : 'X';
    computerPlayer = isComputerX ? 'X' : 'O';
    board = ['', '', '', '', '', '', '', '', ''];
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('taken');
    });
    statusText.textContent = `Ваш хід (${currentPlayer})`;
    if (currentPlayer === computerPlayer) {
        setTimeout(bestMove, 500);
    }
}

function checkWinner(player) {
    return winningCombos.some(combo =>
        combo.every(index => board[index] === player)
    );
}

function isDraw() {
    return board.every(cell => cell !== '');
}

function bestMove() {
    let bestScore = -Infinity;
    let move;

    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            board[i] = computerPlayer;
            let score = minimax(board, 0, false);
            board[i] = '';
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    board[move] = computerPlayer;
    cells[move].textContent = computerPlayer;
    cells[move].classList.add('taken');
    if (checkWinner(computerPlayer)) {
        statusText.textContent = `Комп'ютер (${computerPlayer}) виграв!`;
        showPopup("._lose")
        endGame();
    } else if (isDraw()) {
        showPopup("._draw")
        statusText.textContent = "Нічия!";

    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusText.textContent = `Ваш хід (${currentPlayer})`;
    }
}

function minimax(board, depth, isMaximizing) {
    if (checkWinner(computerPlayer)) return 10 - depth; // Комп'ютер виграв
    if (checkWinner(currentPlayer)) return depth - 10; // Гравець виграв
    if (isDraw()) return 0; // Нічия

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = computerPlayer;
                let score = minimax(board, depth + 1, false);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = currentPlayer;
                let score = minimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function handleCellClick(e) {
    const cell = e.target;
    const index = cell.dataset.index;

    if (board[index] === '' && currentPlayer !== computerPlayer) {
        board[index] = currentPlayer;
        cell.textContent = currentPlayer;
        cell.classList.add('taken');

        if (checkWinner(currentPlayer)) {
            statusText.textContent = `Ви (${currentPlayer}) виграли!`;
            showPopup("._win")
            endGame();
        } else if (isDraw()) {
            showPopup("._draw")
            statusText.textContent = "Нічия!";
        } else {
            currentPlayer = computerPlayer;
            statusText.textContent = `Хід комп'ютера (${computerPlayer})`;
            setTimeout(bestMove, 500);
        }
    }
}

function endGame() {
    cells.forEach(cell => cell.classList.add('taken'));
}

restartBtn.addEventListener('click', () => {
    isComputerX = !isComputerX; // Чередуємо ролі
    initializeGame();
});

cells.forEach(cell => cell.addEventListener('click', handleCellClick));

sideBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const side = btn.dataset.side;
        isComputerX = side !== 'X'; // Якщо гравець X, комп'ютер буде O
        document.getElementById('side-selection').style.display = 'none';
        gameContainer.style.display = '';
        restartBtn.style.display = '';
        initializeGame();
    });
});

function showPopup(popup){
    console.log(popup)
    popup = overlay.querySelector(popup)

    overlay.classList.remove("opacity")
    popup.classList.remove("hide")
}

function hidePopup(popup){
    popup = overlay.querySelector(popup)
    overlay.classList.add("opacity")
    popup.classList.add("hide")
}