//TDS
(function () {
    var url = new URL(window.location.href);
    var params = ['l', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'param1', 'param2', 'param3', 'param4', 'creative_type', 'creative_id'];
    var linkParams = ['affid', 'cpaid']; // ищем в url redirectUrl в url:

    if (url.searchParams.has('redirectUrl')) {
        var redirectUrl = new URL(url.searchParams.get('redirectUrl'));

        if (redirectUrl.href.match(/\//g).length === 4 && redirectUrl.searchParams.get('l')) {
            //если ссылка в ссылка redirectUrl корректная
            localStorage.setItem('redirectUrl', redirectUrl.href); // указываем точкой входа домен с протоколом из redirectUrl
        }
    }

    params.forEach(function (param) {
        if (url.searchParams.has(param)) localStorage.setItem(param, url.searchParams.get(param));
    });

    linkParams.forEach(function (linkParam) {
        if (url.searchParams.has(linkParam)) localStorage.setItem(linkParam, url.searchParams.get(linkParam));
    });

    window.addEventListener('click', function (e) {
        var link,
            parent = e.target.closest('a');

        if (parent.getAttribute('href') !== 'https://tds.favbet.partners') {
            return;
        }

        if (parent) {
            e.preventDefault();
            var affid = localStorage.getItem('affid');
            var cpaid = localStorage.getItem('cpaid');

            if (localStorage.getItem("redirectUrl")) {
                link = new URL(localStorage.getItem("redirectUrl"));
            } else {
                link = new URL(parent.href);
                if (affid && cpaid) {
                    link.pathname = '/' + affid + '/' + cpaid;
                }
            }

            params.forEach(function (param) {
                if (url.searchParams.has(param)) {
                    link.searchParams.set(param, localStorage.getItem(param));
                }
            });

            document.location.href = link;
        }
    });
})();


const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const statusTextInfo = document.getElementById('status-text');
const statusContainer = document.querySelector(".land__left");
const statusBox = document.querySelector(".land__status");
const restartBtns = document.querySelectorAll('.restart-game');
const overlay = document.querySelector(".overlay");
const sideBtns = document.querySelectorAll('.side-btn');
const startGame = document.querySelector('.start-game');
const gameContainer = document.getElementById('game');
const landWrapper = document.querySelector('.land');
const statusIconX = document.querySelector('[data-player="X"]');
const statusIconO = document.querySelector('[data-player="O"]');
const gameGrid = document.querySelector('.game-grid');
const persLeft = document.querySelector('.game-pers._left');
const persRight = document.querySelector('.game-pers._right');
const gameOverText = document.querySelector('.game-over');

let board = ['', '', '', '', '', '', '', '', ''];
let isComputerX = true;
let currentPlayer, computerPlayer;

document.body.style.overflow = "hidden";

if (isComputerX) {
    document.querySelector('[data-side="X"]').classList.remove('_active');
    document.querySelector('[data-side="0"]').classList.add('_active');
} else {
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
        cell.classList.remove('taken', 'X-player', 'O-player');
    });

    const line = document.querySelector('.win-line');
    if (line) {
        line.style.transform = 'scaleX(0)';
    }


    checkStatusContainer(currentPlayer);
    checkStatusIcon(currentPlayer);

    statusText.textContent = `${currentPlayer}`;
    statusTextInfo.textContent = `ТВІЙ_ХІД`;
    if (currentPlayer === computerPlayer) {
        setTimeout(bestMove, 500);
    }
}

function checkStatusIcon(player) {
    if (player === 'Гравець 01') {
        statusIconX.classList.add("_active");
        statusIconO.classList.remove("_active");
    }
    if (player === 'Гравець 02') {
        statusIconO.classList.add("_active");
        statusIconX.classList.remove("_active");
    }
}

function checkStatusContainer(player) {
    if (player === 'Гравець 01') {
        statusBox.classList.add("X-player");
        statusBox.classList.remove("O-player");
    }
    if (player === 'Гравець 02') {
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

function isDraw() {
    return board.every(cell => cell !== '');
}

function bestMove() {
    setTimeout(() => {
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

        if (computerPlayer === "Гравець 02") {
            cells[move].classList.add('O-player');
        }
        if (computerPlayer === "Гравець 01") {
            cells[move].classList.add('X-player');
        }

        checkStatusIcon(computerPlayer);
        checkStatusContainer(currentPlayer);
        statusTextInfo.textContent = `ЧЕКАЙ`;

        cells[move].classList.add('taken');

        const winningCombo = checkWinner(computerPlayer);
        if (winningCombo) {
            showWinLine(winningCombo);
            setTimeout(() =>{
                statusText.textContent = `${computerPlayer}`;
                hideAfterGame("lose")
                endGame();
            }, 500)
        } else if (isDraw()) {
            hideAfterGame("draw")
            statusText.textContent = "Нічия!";
        } else {
            setTimeout(() => {
                currentPlayer = currentPlayer === 'Гравець 01' ? 'Гравець 02' : 'Гравець 01';
                checkStatusIcon(currentPlayer);
                checkStatusContainer(currentPlayer);
                statusTextInfo.textContent = `ТВІЙ_ХІД`;
                statusText.textContent = `${currentPlayer}`;
            }, 1500);
        }
    }, 1000);
}

function minimax(board, depth, isMaximizing) {
    if (checkWinner(computerPlayer)) return 10 - depth;
    if (checkWinner(currentPlayer)) return depth - 10;
    if (isDraw()) return 0;

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

        if (currentPlayer === "Гравець 02") {
            cell.classList.add('O-player');
        }
        if (currentPlayer === "Гравець 01") {
            cell.classList.add('X-player');
        }

        cell.classList.add('taken');

        const winningCombo = checkWinner(currentPlayer);
        if (winningCombo) {
            showWinLine(winningCombo);
            setTimeout(() => {
                statusText.textContent = `${currentPlayer}`;
                hideAfterGame("win")
                endGame();
            }, 500);
        } else if (isDraw()) {
            setTimeout(() => {
                hideAfterGame("draw")
                statusText.textContent = "Нічия!";
            }, 500);
        } else {
            setTimeout(() =>{
                statusText.textContent = `${computerPlayer}`;
            },1500)
            currentPlayer = computerPlayer;

            setTimeout(bestMove, 500);
        }
    }
}

function hideAfterGame(winner){
    gameContainer.style.opacity = "0";
    gameGrid.style.opacity = "0";
    statusBox.classList.remove("O-player", "X-player");
    persLeft.style.transform = "translateX(220%)";
    persRight.style.transform = "translateX(-220%) scale(-1, 1)";



    if(winner === "lose"){
        gameOverText.textContent = "не пощастило!"
    }
    if(winner === "win"){
        gameOverText.textContent = "ти переміг!"
    }
    if(winner === "draw"){
        gameOverText.textContent = "ти був на рівні!"
    }

    setTimeout(() =>{
        gameOverText.classList.remove("opacity")
        setTimeout(() =>{
            if(winner === "draw"){
                showPopup("._draw");
            }
            if(winner === "win"){
                showPopup("._win");
            }
            if(winner === "lose"){
                showPopup("._lose");
            }
        }, 200)

    }, 200)

}

function endGame() {
    cells.forEach(cell => cell.classList.add('taken'));
}

restartBtns.forEach(btn =>{
    btn.addEventListener('click', () => {
            isComputerX = !isComputerX;
            initializeGame();
            gameOverText.textContent = ``;
            gameGrid.style.opacity = "1";
            gameContainer.style.opacity = "1";
            persLeft.style.transform = "translateX(0%)";
            persRight.style.transform = "translateX(0%) scale(-1, 1)";
            sideBtns.forEach(btn => {
                btn.classList.remove("_active")
                startGame.classList.add("disabled");
                btn.addEventListener('click', () => {
                    startGame.classList.remove("disabled");
                    const side = btn.dataset.side;
                    isComputerX = side !== 'X';
                    sideBtns.forEach(item => item.classList.remove('_active'));
                    btn.classList.add('_active');
                });
            });

            // document.body.style.overflow = "auto";
            document.querySelectorAll(".popup").forEach(popup => {
                if(popup.classList.contains('_start')){
                    popup.classList.remove('hide-popup');
                    popup.classList.remove('hide');
                    popup.style.opacity = "1";
                }else{
                    popup.classList.add('hide-popup');
                }
            })
        });
})

cells.forEach(cell => cell.addEventListener('click', handleCellClick));

sideBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const side = btn.dataset.side;
        isComputerX = side !== 'X';
        sideBtns.forEach(item => item.classList.remove('_active'));
        btn.classList.add('_active');
    });
});

startGame.addEventListener('click', () => {
    document.getElementById('side-selection').style.opacity = '0';
    gameContainer.style.opacity = '1';
    landWrapper.classList.add("_decor");
    document.body.style.overflow = "auto";
    setTimeout(() => {
        enableMouseScale(document.querySelector('.decor'));
    }, 2500);
    initializeGame();
    hidePopup("#side-selection");
});

function showPopup(popup) {

    setTimeout(() => {
        popup = overlay.querySelector(popup);
        overlay.classList.remove("opacity");
        document.body.style.overflow = "hidden";
        setTimeout(() =>{
            popup.classList.remove("hide-popup");
        }, 500)
    }, 2000)

}

function hidePopup(popup) {
    popup = overlay.querySelector(popup);
    overlay.classList.add("opacity");
    popup.classList.add("hide");
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
    line.style.transform = 'scaleX(0)';
    // line.style.width = '100%';
    // line.style.height = '44px';
    // line.style.background = '#00f0ff';

    const positions = {
        '0,1,2': { top: '26%', left: '50%', rotate: '0deg', width: '80%' },
        '3,4,5': { top: '52%', left: '50%', rotate: '0deg', width: '80%' },
        '6,7,8': { top: '78.33%', left: '50%', rotate: '0deg', width: '80%' },
        '0,3,6': { top: '50%', left: '24.5%', rotate: '90deg', width: '80%'},
        '1,4,7': { top: '50%', left: '50%', rotate: '90deg', width: '80%' },
        '2,5,8': { top: '50%', left: '76.5%', rotate: '90deg', width: '80%' },
        '0,4,8': { top: '50%', left: '50%', rotate: '45deg', width: '100%' },
        '2,4,6': { top: '50%', left: '50%', rotate: '-45deg', width: '100%' },
    };

    const key = combo.sort((a, b) => a - b).join(',');


    const pos = positions[key];

    let width = pos.width;

    if (pos) {
        line.style.top = pos.top;
        line.style.left = pos.left;
        line.style.transform = `translate(-50%, -50%) rotate(${pos.rotate}) scaleX(1)`;
        line.style.width = `${pos.width}`;
        line.style.opacity = `1`;
    }
}