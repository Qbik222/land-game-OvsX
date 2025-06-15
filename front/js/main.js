const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const statusTextInfo = document.getElementById('status-text');
const statusContainer = document.querySelector(".land__left")
const statusBox = document.querySelector(".land__status")
const restartBtn = document.getElementById('restart');
const overlay = document.querySelector(".overlay");
const sideBtns = document.querySelectorAll('.side-btn');
const startGame = document.querySelector('.start-game');
const gameContainer = document.getElementById('game');
const landWrapper = document.querySelector('.land');
const statusIconX = document.querySelector('[data-player="X"]');
const statusIconO = document.querySelector('[data-player="O"]');


let board = ['', '', '', '', '', '', '', '', ''];
let isComputerX = true; // Чередує роль комп'ютера між X та O
let currentPlayer, computerPlayer;

if (isComputerX) {
    document.querySelector('[data-side="X"]').classList.remove('_active');
    document.querySelector('[data-side="0"]').classList.add('_active');
}else{
    document.querySelector('[data-side="0"]').classList.remove('_active');
    document.querySelector('[data-side="X"]').classList.add('_active');
}

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
    currentPlayer = isComputerX ? 'Гравець 02' : 'Гравець 01';
    computerPlayer = isComputerX ? 'Гравець 01' : 'Гравець 02';
    board = ['', '', '', '', '', '', '', '', ''];
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('taken');
    });

    checkStatusIcon(currentPlayer)
    checkStatusContainer(currentPlayer)

    statusText.textContent = `${currentPlayer}`;
    statusTextInfo.textContent = `ТВІЙ_ХІД`;
    if (currentPlayer === computerPlayer) {
        setTimeout(bestMove, 500);
    }
}

function checkStatusIcon(player) {

    console.log(player)

    if(player === 'Гравець 01'){
        statusIconX.classList.add("_active");
        statusIconO.classList.remove("_active");
    }
    if(player === 'Гравець 02'){
        statusIconO.classList.add("_active");
        statusIconX.classList.remove("_active");
    }
}

function checkStatusContainer(player) {

    console.log(player)

    if(player === 'Гравець 01'){
        statusBox.classList.add("X-player");
        statusBox.classList.remove("O-player");
    }
    if(player === 'Гравець 02'){
        statusBox.classList.add("O-player");
        statusBox.classList.remove("X-player");
    }
}

function checkWinner(player) {
    for (const combo of winningCombos) {
        if (combo.every(index => board[index] === player)) {
            return combo;
        }
    }
    return null;
}


// function checkWinner(player) {
//     return winningCombos.some(combo =>
//         combo.every(index => board[index] === player)
//     );
// }

function isDraw() {
    return board.every(cell => cell !== '');
}

function bestMove() {

    setTimeout(() =>{
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

        // cells[move].classList.add('taken');

        if(computerPlayer === "Гравець 02") {
            cells[move].classList.add('O-player');
        }
        if(computerPlayer === "Гравець 01") {
            cells[move].classList.add('X-player');
        }
        checkStatusIcon(computerPlayer)
        checkStatusContainer(currentPlayer)
        statusTextInfo.textContent = `ЧЕКАЙ`;

        // cells[move].textContent = computerPlayer;
        cells[move].classList.add('taken');
        if (checkWinner(computerPlayer)) {
            statusText.textContent = `${computerPlayer}`;
            showPopup("._lose")
            endGame();
        } else if (isDraw()) {
            showPopup("._draw")
            statusText.textContent = "Нічия!";

        } else {


            setTimeout(() =>{
                currentPlayer = currentPlayer === 'Гравець 01' ? 'Гравець 02' : 'Гравець 01';
                checkStatusIcon(currentPlayer)
                checkStatusContainer(currentPlayer)
                statusTextInfo.textContent = `ТВІЙ_ХІД`;
                statusText.textContent = `${currentPlayer}`;

            }, 1500)
        }
    }, 1000)


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

       console.log(currentPlayer);

       if(currentPlayer === "Гравець 02") {
           cell.classList.add('O-player');
       }
        if(currentPlayer === "Гравець 01") {
            cell.classList.add('X-player');
        }


        // cell.textContent = currentPlayer;
        cell.classList.add('taken');

        if (checkWinner(currentPlayer)) {
            setTimeout(() =>{
                statusText.textContent = `${currentPlayer}`;
                showPopup("._win")
                endGame();
            }, 2000)

        } else if (isDraw()) {
            setTimeout(() =>{
                showPopup("._draw")
                statusText.textContent = "Нічия!";
            }, 2000)

        } else {
            currentPlayer = computerPlayer;
            statusText.textContent = `${computerPlayer}`;
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
        sideBtns.forEach(item => item.classList.remove('_active'));
        btn.classList.add('_active');
    });
});

startGame.addEventListener('click', () =>{
    document.getElementById('side-selection').style.opacity = '0';
    gameContainer.style.opacity = '1';
    restartBtn.style.display = '';
    landWrapper.classList.add("_decor")
    setTimeout(() =>{
        enableMouseScale(document.querySelector('.decor'));

    }, 2500)
    initializeGame();
    hidePopup("#side-selection");
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

function enableMouseScale(element) {
    const minScale = 1;
    const maxScale = 1.05;

    element.style.transition = 'transform 0.1s ease';

    document.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const distance = Math.hypot(x - centerX, y - centerY);
        const maxDistance = Math.hypot(centerX, centerY);

        const scale = minScale + (1 - distance / maxDistance) * (maxScale - minScale);
        element.style.transform = `scale(${Math.min(maxScale, Math.max(minScale, scale))})`;
    });

    element.addEventListener('mouseleave', () => {
        element.style.transform = `scale(${minScale})`;
    });
}

function showWinLine(combo) {
    const line = document.querySelector('.win-line');
    line.style.transform = 'scaleX(0)'; // Reset before new line
    line.style.width = '100%';
    line.style.height = '4px';
    line.style.background = '#00f0ff';

    // Клітинки мають індекси від 0 до 8:
    // 0 | 1 | 2
    // 3 | 4 | 5
    // 6 | 7 | 8

    const positions = {
        '0,1,2': { top: '16.66%', left: '50%', rotate: '0deg' },
        '3,4,5': { top: '50%', left: '50%', rotate: '0deg' },
        '6,7,8': { top: '83.33%', left: '50%', rotate: '0deg' },
        '0,3,6': { top: '50%', left: '16.66%', rotate: '90deg' },
        '1,4,7': { top: '50%', left: '50%', rotate: '90deg' },
        '2,5,8': { top: '50%', left: '83.33%', rotate: '90deg' },
        '0,4,8': { top: '50%', left: '50%', rotate: '45deg' },
        '2,4,6': { top: '50%', left: '50%', rotate: '-45deg' },
    };

    const key = combo.sort((a, b) => a - b).join(',');
    const pos = positions[key];

    if (pos) {
        line.style.top = pos.top;
        line.style.left = pos.left;
        line.style.transform = `translate(-50%, -50%) rotate(${pos.rotate}) scaleX(1)`;
    }
}




// test
const testPopupButtons = document.querySelectorAll('.test-popup');

testPopupButtons.forEach(button => {
    button.addEventListener('click', () => {
        const popupClass = button.dataset.popup;
        const popup = overlay.querySelector(popupClass);
        const allPopups = overlay.querySelectorAll('.popup');

        const isAlreadyOpen = !popup.classList.contains('hide');

        if (isAlreadyOpen) {
            overlay.classList.add('opacity');
            popup.classList.add('hide');
        } else {
            allPopups.forEach(p => p.classList.add('hide'));
            overlay.classList.remove('opacity');
            popup.classList.remove('hide');
        }
    });
});

