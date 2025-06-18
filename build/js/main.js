"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var cells = document.querySelectorAll('.cell');
var statusText = document.getElementById('status');
var statusTextInfo = document.getElementById('status-text');
var statusContainer = document.querySelector(".land__left");
var statusBox = document.querySelector(".land__status");
var restartBtns = document.querySelectorAll('.restart-game');
var overlay = document.querySelector(".overlay");
var sideBtns = document.querySelectorAll('.side-btn');
var startGame = document.querySelector('.start-game');
var gameContainer = document.getElementById('game');
var landWrapper = document.querySelector('.land');
var statusIconX = document.querySelector('[data-player="X"]');
var statusIconO = document.querySelector('[data-player="O"]');
var gameGrid = document.querySelector('.game-grid');
var persLeft = document.querySelector('.game-pers._left');
var persRight = document.querySelector('.game-pers._right');
var gameOverText = document.querySelector('.game-over');
var board = ['', '', '', '', '', '', '', '', ''];
var isComputerX = true;
var currentPlayer, computerPlayer;
document.body.style.overflow = "hidden";
if (isComputerX) {
  document.querySelector('[data-side="X"]').classList.remove('_active');
  document.querySelector('[data-side="0"]').classList.add('_active');
} else {
  document.querySelector('[data-side="0"]').classList.remove('_active');
  document.querySelector('[data-side="X"]').classList.add('_active');
}
var winningCombos = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
function initializeGame() {
  currentPlayer = isComputerX ? 'Гравець 02' : 'Гравець 01';
  computerPlayer = isComputerX ? 'Гравець 01' : 'Гравець 02';
  board = ['', '', '', '', '', '', '', '', ''];
  cells.forEach(function (cell) {
    cell.textContent = '';
    cell.classList.remove('taken', 'X-player', 'O-player');
  });
  var line = document.querySelector('.win-line');
  if (line) {
    line.style.transform = 'scaleX(0)';
  }
  checkStatusIcon(currentPlayer);
  checkStatusContainer(currentPlayer);
  statusText.textContent = "".concat(currentPlayer);
  statusTextInfo.textContent = "\u0422\u0412\u0406\u0419_\u0425\u0406\u0414";
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
  var _iterator = _createForOfIteratorHelper(winningCombos),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var combo = _step.value;
      if (combo.every(function (index) {
        return board[index] === player;
      })) {
        return combo;
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return null;
}
function isDraw() {
  return board.every(function (cell) {
    return cell !== '';
  });
}
function bestMove() {
  setTimeout(function () {
    var bestScore = -Infinity;
    var move;
    for (var i = 0; i < board.length; i++) {
      if (board[i] === '') {
        board[i] = computerPlayer;
        var score = minimax(board, 0, false);
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
    statusTextInfo.textContent = "\u0427\u0415\u041A\u0410\u0419";
    cells[move].classList.add('taken');
    var winningCombo = checkWinner(computerPlayer);
    if (winningCombo) {
      showWinLine(winningCombo);
      setTimeout(function () {
        statusText.textContent = "".concat(computerPlayer);
        hideAfterGame("lose");
        endGame();
      }, 1000);
    } else if (isDraw()) {
      hideAfterGame("draw");
      statusText.textContent = "Нічия!";
    } else {
      setTimeout(function () {
        currentPlayer = currentPlayer === 'Гравець 01' ? 'Гравець 02' : 'Гравець 01';
        checkStatusIcon(currentPlayer);
        checkStatusContainer(currentPlayer);
        statusTextInfo.textContent = "\u0422\u0412\u0406\u0419_\u0425\u0406\u0414";
        statusText.textContent = "".concat(currentPlayer);
      }, 1500);
    }
  }, 1000);
}
function minimax(board, depth, isMaximizing) {
  if (checkWinner(computerPlayer)) return 10 - depth;
  if (checkWinner(currentPlayer)) return depth - 10;
  if (isDraw()) return 0;
  if (isMaximizing) {
    var bestScore = -Infinity;
    for (var i = 0; i < board.length; i++) {
      if (board[i] === '') {
        board[i] = computerPlayer;
        var score = minimax(board, depth + 1, false);
        board[i] = '';
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    var _bestScore = Infinity;
    for (var _i = 0; _i < board.length; _i++) {
      if (board[_i] === '') {
        board[_i] = currentPlayer;
        var _score = minimax(board, depth + 1, true);
        board[_i] = '';
        _bestScore = Math.min(_score, _bestScore);
      }
    }
    return _bestScore;
  }
}
function handleCellClick(e) {
  var cell = e.target;
  var index = cell.dataset.index;
  if (board[index] === '' && currentPlayer !== computerPlayer) {
    board[index] = currentPlayer;
    if (currentPlayer === "Гравець 02") {
      cell.classList.add('O-player');
    }
    if (currentPlayer === "Гравець 01") {
      cell.classList.add('X-player');
    }
    cell.classList.add('taken');
    var winningCombo = checkWinner(currentPlayer);
    if (winningCombo) {
      showWinLine(winningCombo);
      setTimeout(function () {
        statusText.textContent = "".concat(currentPlayer);
        hideAfterGame("win");
        endGame();
      }, 1000);
    } else if (isDraw()) {
      setTimeout(function () {
        hideAfterGame("draw");
        statusText.textContent = "Нічия!";
      }, 1000);
    } else {
      currentPlayer = computerPlayer;
      statusText.textContent = "".concat(computerPlayer);
      setTimeout(bestMove, 500);
    }
  }
}
function hideAfterGame(winner) {
  gameContainer.style.opacity = "0";
  gameGrid.style.opacity = "0";
  statusBox.classList.remove("O-player", "X-player");
  persLeft.style.transform = "translateX(220%)";
  persRight.style.transform = "translateX(-220%) scale(-1, 1)";
  if (winner === "lose") {
    gameOverText.textContent = "не пощастило!";
  }
  if (winner === "win") {
    gameOverText.textContent = "ти переміг!";
  }
  if (winner === "draw") {
    gameOverText.textContent = "ти був на рівні!";
  }
  setTimeout(function () {
    gameOverText.classList.remove("opacity");
    setTimeout(function () {
      if (winner === "draw") {
        showPopup("._draw");
      }
      if (winner === "win") {
        showPopup("._win");
      }
      if (winner === "lose") {
        showPopup("._lose");
      }
    }, 500);
  }, 1000);
}
function endGame() {
  cells.forEach(function (cell) {
    return cell.classList.add('taken');
  });
}
restartBtns.forEach(function (btn) {
  btn.addEventListener('click', function () {
    isComputerX = !isComputerX;
    initializeGame();
    gameOverText.textContent = "";
    gameGrid.style.opacity = "1";
    gameContainer.style.opacity = "1";
    persLeft.style.transform = "translateX(0%)";
    persRight.style.transform = "translateX(0%) scale(-1, 1)";
    sideBtns.forEach(function (btn) {
      btn.classList.remove("_active");
      startGame.classList.add("disabled");
      btn.addEventListener('click', function () {
        console.log(isComputerX);
        startGame.classList.remove("disabled");
        var side = btn.dataset.side;
        isComputerX = side !== 'X';
        sideBtns.forEach(function (item) {
          return item.classList.remove('_active');
        });
        btn.classList.add('_active');
      });
    });

    // document.body.style.overflow = "auto";
    document.querySelectorAll(".popup").forEach(function (popup) {
      if (popup.classList.contains('_start')) {
        popup.classList.remove('hide-popup');
        popup.classList.remove('hide');
        popup.style.opacity = "1";
      } else {
        popup.classList.add('hide-popup');
      }
    });
  });
});
cells.forEach(function (cell) {
  return cell.addEventListener('click', handleCellClick);
});
sideBtns.forEach(function (btn) {
  btn.addEventListener('click', function () {
    var side = btn.dataset.side;
    isComputerX = side !== 'X';
    sideBtns.forEach(function (item) {
      return item.classList.remove('_active');
    });
    btn.classList.add('_active');
  });
});
startGame.addEventListener('click', function () {
  document.getElementById('side-selection').style.opacity = '0';
  gameContainer.style.opacity = '1';
  landWrapper.classList.add("_decor");
  document.body.style.overflow = "auto";
  setTimeout(function () {
    enableMouseScale(document.querySelector('.decor'));
  }, 2500);
  initializeGame();
  hidePopup("#side-selection");
});
function showPopup(popup) {
  setTimeout(function () {
    popup = overlay.querySelector(popup);
    overlay.classList.remove("opacity");
    document.body.style.overflow = "hidden";
    setTimeout(function () {
      popup.classList.remove("hide-popup");
    }, 500);
  }, 2000);
}
function hidePopup(popup) {
  popup = overlay.querySelector(popup);
  overlay.classList.add("opacity");
  popup.classList.add("hide");
}
function enableMouseScale(element) {
  var minScale = 1;
  var maxScale = 1.05;
  element.style.transition = 'transform 0.1s ease';
  document.addEventListener('mousemove', function (e) {
    var rect = element.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    var centerX = rect.width / 2;
    var centerY = rect.height / 2;
    var distance = Math.hypot(x - centerX, y - centerY);
    var maxDistance = Math.hypot(centerX, centerY);
    var scale = minScale + (1 - distance / maxDistance) * (maxScale - minScale);
    element.style.transform = "scale(".concat(Math.min(maxScale, Math.max(minScale, scale)), ")");
  });
  element.addEventListener('mouseleave', function () {
    element.style.transform = "scale(".concat(minScale, ")");
  });
}
function showWinLine(combo) {
  var line = document.querySelector('.win-line');
  line.style.transform = 'scaleX(0)';
  // line.style.width = '100%';
  // line.style.height = '44px';
  // line.style.background = '#00f0ff';

  var positions = {
    '0,1,2': {
      top: '26%',
      left: '50%',
      rotate: '0deg',
      width: '80%'
    },
    '3,4,5': {
      top: '50%',
      left: '50%',
      rotate: '0deg',
      width: '80%'
    },
    '6,7,8': {
      top: '78.33%',
      left: '50%',
      rotate: '0deg',
      width: '80%'
    },
    '0,3,6': {
      top: '50%',
      left: '24.5%',
      rotate: '90deg',
      width: '80%'
    },
    '1,4,7': {
      top: '50%',
      left: '50%',
      rotate: '90deg',
      width: '80%'
    },
    '2,5,8': {
      top: '50%',
      left: '76.5%',
      rotate: '90deg',
      width: '80%'
    },
    '0,4,8': {
      top: '50%',
      left: '50%',
      rotate: '45deg',
      width: '100%'
    },
    '2,4,6': {
      top: '50%',
      left: '50%',
      rotate: '-45deg',
      width: '100%'
    }
  };
  var key = combo.sort(function (a, b) {
    return a - b;
  }).join(',');
  console.log(key);
  var pos = positions[key];
  console.log(pos.width);
  var width = pos.width;
  if (pos) {
    line.style.top = pos.top;
    line.style.left = pos.left;
    line.style.transform = "translate(-50%, -50%) rotate(".concat(pos.rotate, ") scaleX(1)");
    line.style.width = "".concat(pos.width);
    line.style.opacity = "1";
  }
}

// test
var testPopupButtons = document.querySelectorAll('.test-popup');
testPopupButtons.forEach(function (button) {
  button.addEventListener('click', function () {
    var popupClass = button.dataset.popup;
    var popup = overlay.querySelector(popupClass);
    var allPopups = overlay.querySelectorAll('.popup');
    var isAlreadyOpen = !popup.classList.contains('hide-popup');
    if (isAlreadyOpen) {
      overlay.classList.add('opacity');
      popup.classList.add('hide-popup');
    } else {
      allPopups.forEach(function (p) {
        return p.classList.add('hide-popup');
      });
      overlay.classList.remove('opacity');
      popup.classList.remove('hide-popup');
    }
  });
});

// Додаємо цей код в кінець вашого існуючого скрипта

// Створюємо випадаюче меню для тестових сценаріїв
var testMenu = document.createElement('div');
testMenu.className = 'test-dropdown';
testMenu.innerHTML = "\n  <button class=\"test-dropdown-btn\">\u0422\u0435\u0441\u0442 \u0441\u0446\u0435\u043D\u0430\u0440\u0456\u0457\u0432 \u25BC</button>\n  <div class=\"test-dropdown-content\">\n    <button class=\"test-scenario\" data-scenario=\"win\">\u0422\u0435\u0441\u0442 Win</button>\n    <button class=\"test-scenario\" data-scenario=\"lose\">\u0422\u0435\u0441\u0442 Lose</button>\n    <button class=\"test-scenario\" data-scenario=\"draw\">\u0422\u0435\u0441\u0442 Draw</button>\n    <button class=\"test-scenario\" data-scenario=\"reset\">\u0421\u043A\u0438\u043D\u0443\u0442\u0438 \u0433\u0440\u0443</button>\n  </div>\n";

// Додаємо стилі для випадаючого меню
var style = document.createElement('style');
style.textContent = "\n  .test-dropdown {\n    z-index: 9999;\n  }\n  \n  .test-dropdown-btn {\n    background-color: #4CAF50;\n    color: white;\n    padding: 10px;\n    font-size: 16px;\n    border: none;\n    cursor: pointer;\n    border-radius: 4px;\n  }\n  \n  .test-dropdown-content {\n    display: none;\n    position: absolute;\n    background-color: #f9f9f9;\n    min-width: 160px;\n    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);\n    z-index: 1;\n    border-radius: 4px;\n    overflow: hidden;\n  }\n  \n  .test-dropdown-content button {\n    color: black;\n    padding: 12px 16px;\n    text-decoration: none;\n    display: block;\n    width: 100%;\n    text-align: left;\n    border: none;\n    background: none;\n    cursor: pointer;\n  }\n  \n  .test-dropdown-content button:hover {\n    background-color: #f1f1f1;\n  }\n  \n  .test-dropdown:hover .test-dropdown-content {\n    display: block;\n  }\n";
document.head.appendChild(style);
document.querySelector(".test-menu").appendChild(testMenu);

// Функція для симуляції виграшу
function simulateWin() {
  // Очищаємо дошку
  board = ['', '', '', '', '', '', '', '', ''];

  // Встановлюємо виграшну комбінацію для гравця
  board[0] = 'Гравець 01';
  board[1] = 'Гравець 01';
  board[2] = 'Гравець 01';

  // Оновлюємо UI
  cells.forEach(function (cell, index) {
    // cell.textContent = '';
    cell.classList.remove('taken', 'X-player', 'O-player');
    if (board[index] === 'Гравець 01') {
      // cell.textContent = 'X';
      cell.classList.add('X-player', 'taken');
    }
  });

  // Показуємо лінію перемоги
  showWinLine([0, 1, 2]);

  // Запускаємо анімацію завершення гри
  setTimeout(function () {
    statusText.textContent = 'Гравець 01';
    hideAfterGame("win");
    endGame();
  }, 1000);
}

// Функція для симуляції програшу
function simulateLose() {
  // Очищаємо дошку
  board = ['', '', '', '', '', '', '', '', ''];

  // Встановлюємо виграшну комбінацію для комп'ютера
  board[3] = 'Гравець 02';
  board[4] = 'Гравець 02';
  board[5] = 'Гравець 02';

  // Оновлюємо UI
  cells.forEach(function (cell, index) {
    // cell.textContent = '';
    cell.classList.remove('taken', 'X-player', 'O-player');
    if (board[index] === 'Гравець 02') {
      // cell.textContent = 'O';
      cell.classList.add('O-player', 'taken');
    }
  });

  // Показуємо лінію перемоги
  showWinLine([3, 4, 5]);

  // Запускаємо анімацію завершення гри
  setTimeout(function () {
    statusText.textContent = 'Гравець 02';
    hideAfterGame("lose");
    endGame();
  }, 1000);
}

// Функція для симуляції нічиї
function simulateDraw() {
  // Очищаємо дошку
  board = ['', '', '', '', '', '', '', '', ''];

  // Встановлюємо нічийну дошку
  board[0] = 'Гравець 01';
  board[1] = 'Гравець 02';
  board[2] = 'Гравець 01';
  board[3] = 'Гравець 01';
  board[4] = 'Гравець 02';
  board[5] = 'Гравець 01';
  board[6] = 'Гравець 02';
  board[7] = 'Гравець 01';
  board[8] = 'Гравець 02';

  // Оновлюємо UI
  cells.forEach(function (cell, index) {
    // cell.textContent = '';
    cell.classList.remove('taken', 'X-player', 'O-player');
    if (board[index] === 'Гравець 01') {
      // cell.textContent = 'X';
      cell.classList.add('X-player', 'taken');
    } else if (board[index] === 'Гравець 02') {
      // cell.textContent = 'O';
      cell.classList.add('O-player', 'taken');
    }
  });

  // Запускаємо анімацію завершення гри
  setTimeout(function () {
    statusText.textContent = "Нічия!";
    hideAfterGame("draw");
  }, 1000);
}

// Обробник кліків для тестових сценаріїв
document.querySelectorAll('.test-scenario').forEach(function (btn) {
  btn.addEventListener('click', function (e) {
    var scenario = e.target.dataset.scenario;
    switch (scenario) {
      case 'win':
        simulateWin();
        break;
      case 'lose':
        simulateLose();
        break;
      case 'draw':
        simulateDraw();
        break;
      case 'reset':
        initializeGame();
        gameOverText.textContent = "";
        gameGrid.style.opacity = "1";
        gameContainer.style.opacity = "1";
        persLeft.style.transform = "translateX(0%)";
        persRight.style.transform = "translateX(0%) scale(-1, 1)";
        break;
    }

    // Ховаємо випадаюче меню після вибору
    document.querySelector('.test-dropdown-content').style.display = 'none';
  });
});

// Ховаємо випадаюче меню при кліку поза ним
document.addEventListener('click', function (e) {
  console.log(e.target);
  if (!e.target.closest('.test-dropdown')) {
    document.querySelector('.test-dropdown-content').style.display = 'none';
  } else {
    document.querySelector('.test-dropdown-content').style.display = 'block';
  }
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiY2VsbHMiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJzdGF0dXNUZXh0IiwiZ2V0RWxlbWVudEJ5SWQiLCJzdGF0dXNUZXh0SW5mbyIsInN0YXR1c0NvbnRhaW5lciIsInF1ZXJ5U2VsZWN0b3IiLCJzdGF0dXNCb3giLCJyZXN0YXJ0QnRucyIsIm92ZXJsYXkiLCJzaWRlQnRucyIsInN0YXJ0R2FtZSIsImdhbWVDb250YWluZXIiLCJsYW5kV3JhcHBlciIsInN0YXR1c0ljb25YIiwic3RhdHVzSWNvbk8iLCJnYW1lR3JpZCIsInBlcnNMZWZ0IiwicGVyc1JpZ2h0IiwiZ2FtZU92ZXJUZXh0IiwiYm9hcmQiLCJpc0NvbXB1dGVyWCIsImN1cnJlbnRQbGF5ZXIiLCJjb21wdXRlclBsYXllciIsImJvZHkiLCJzdHlsZSIsIm92ZXJmbG93IiwiY2xhc3NMaXN0IiwicmVtb3ZlIiwiYWRkIiwid2lubmluZ0NvbWJvcyIsImluaXRpYWxpemVHYW1lIiwiZm9yRWFjaCIsImNlbGwiLCJ0ZXh0Q29udGVudCIsImxpbmUiLCJ0cmFuc2Zvcm0iLCJjaGVja1N0YXR1c0ljb24iLCJjaGVja1N0YXR1c0NvbnRhaW5lciIsInNldFRpbWVvdXQiLCJiZXN0TW92ZSIsInBsYXllciIsImNoZWNrV2lubmVyIiwiY29tYm8iLCJldmVyeSIsImluZGV4IiwiaXNEcmF3IiwiYmVzdFNjb3JlIiwiSW5maW5pdHkiLCJtb3ZlIiwiaSIsImxlbmd0aCIsInNjb3JlIiwibWluaW1heCIsIndpbm5pbmdDb21ibyIsInNob3dXaW5MaW5lIiwiaGlkZUFmdGVyR2FtZSIsImVuZEdhbWUiLCJkZXB0aCIsImlzTWF4aW1pemluZyIsIk1hdGgiLCJtYXgiLCJtaW4iLCJoYW5kbGVDZWxsQ2xpY2siLCJlIiwidGFyZ2V0IiwiZGF0YXNldCIsIndpbm5lciIsIm9wYWNpdHkiLCJzaG93UG9wdXAiLCJidG4iLCJhZGRFdmVudExpc3RlbmVyIiwiY29uc29sZSIsImxvZyIsInNpZGUiLCJpdGVtIiwicG9wdXAiLCJjb250YWlucyIsImVuYWJsZU1vdXNlU2NhbGUiLCJoaWRlUG9wdXAiLCJlbGVtZW50IiwibWluU2NhbGUiLCJtYXhTY2FsZSIsInRyYW5zaXRpb24iLCJyZWN0IiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwieCIsImNsaWVudFgiLCJsZWZ0IiwieSIsImNsaWVudFkiLCJ0b3AiLCJjZW50ZXJYIiwid2lkdGgiLCJjZW50ZXJZIiwiaGVpZ2h0IiwiZGlzdGFuY2UiLCJoeXBvdCIsIm1heERpc3RhbmNlIiwic2NhbGUiLCJwb3NpdGlvbnMiLCJyb3RhdGUiLCJrZXkiLCJzb3J0IiwiYSIsImIiLCJqb2luIiwicG9zIiwidGVzdFBvcHVwQnV0dG9ucyIsImJ1dHRvbiIsInBvcHVwQ2xhc3MiLCJhbGxQb3B1cHMiLCJpc0FscmVhZHlPcGVuIiwicCIsInRlc3RNZW51IiwiY3JlYXRlRWxlbWVudCIsImNsYXNzTmFtZSIsImlubmVySFRNTCIsImhlYWQiLCJhcHBlbmRDaGlsZCIsInNpbXVsYXRlV2luIiwic2ltdWxhdGVMb3NlIiwic2ltdWxhdGVEcmF3Iiwic2NlbmFyaW8iLCJkaXNwbGF5IiwiY2xvc2VzdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxJQUFNQSxLQUFLLEdBQUdDLFFBQVEsQ0FBQ0MsZ0JBQWdCLENBQUMsT0FBTyxDQUFDO0FBQ2hELElBQU1DLFVBQVUsR0FBR0YsUUFBUSxDQUFDRyxjQUFjLENBQUMsUUFBUSxDQUFDO0FBQ3BELElBQU1DLGNBQWMsR0FBR0osUUFBUSxDQUFDRyxjQUFjLENBQUMsYUFBYSxDQUFDO0FBQzdELElBQU1FLGVBQWUsR0FBR0wsUUFBUSxDQUFDTSxhQUFhLENBQUMsYUFBYSxDQUFDO0FBQzdELElBQU1DLFNBQVMsR0FBR1AsUUFBUSxDQUFDTSxhQUFhLENBQUMsZUFBZSxDQUFDO0FBQ3pELElBQU1FLFdBQVcsR0FBR1IsUUFBUSxDQUFDQyxnQkFBZ0IsQ0FBQyxlQUFlLENBQUM7QUFDOUQsSUFB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Q2QsT0FBTyxFQUFFO01BQUVULEdBQUcsRUFBRSxLQUFLO01BQUVILElBQUksRUFBRSxLQUFLO01BQUVhLE1BQU0sRUFBRSxNQUFNO01BQUVSLEtBQUssRUFBRTtJQUFNLENBQUM7SUFDbEUsT0FBTyxFQUFFO01BQUVGLEdBQUcsRUFBRSxLQUFLO01BQUVILElBQUksRUFBRSxLQUFLO01BQUVhLE1BQU0sRUFBRSxNQUFNO01BQUVSLEtBQUssRUFBRTtJQUFNLENBQUM7SUFDbEUsT0FBTyxFQUFFO01BQUVGLEdBQUcsRUFBRSxRQUFRO01BQUVILElBQUksRUFBRSxLQUFLO01BQUVhLE1BQU0sRUFBRSxNQUFNO01BQUVSLEtBQUssRUFBRTtJQUFNLENBQUM7SUFDckUsT0FBTyxFQUFFO01BQUVGLEdBQUcsRUFBRSxLQUFLO01BQUVILElBQUksRUFBRSxPQUFPO01BQUVhLE1BQU0sRUFBRSxPQUFPO01BQUVSLEtBQUssRUFBRTtJQUFLLENBQUM7SUFDcEUsT0FBTyxFQUFFO01BQUVGLEdBQUcsRUFBRSxLQUFLO01BQUVILElBQUksRUFBRSxLQUFLO01BQUVhLE1BQU0sRUFBRSxPQUFPO01BQUVSLEtBQUssRUFBRTtJQUFNLENBQUM7SUFDbkUsT0FBTyxFQUFFO01BQUVGLEdBQUcsRUFBRSxLQUFLO01BQUVILElBQUksRUFBRSxPQUFPO01BQUVhLE1BQU0sRUFBRSxPQUFPO01BQUVSLEtBQUssRUFBRTtJQUFNLENBQUM7SUFDckUsT0FBTyxFQUFFO01BQUVGLEdBQUcsRUFBRSxLQUFLO01BQUVILElBQUksRUFBRSxLQUFLO01BQUVhLE1BQU0sRUFBRSxPQUFPO01BQUVSLEtBQUssRUFBRTtJQUFPLENBQUM7SUFDcEUsT0FBTyxFQUFFO01BQUVGLEdBQUcsRUFBRSxLQUFLO01BQUVILElBQUksRUFBRSxLQUFLO01BQUVhLE1BQU0sRUFBRSxRQUFRO01BQUVSLEtBQUssRUFBRTtJQUFPO0VBQ3hFLENBQUM7RUFFRCxJQUFNUyxHQUFHLEdBQUczRCxLQUFLLENBQUM0RCxJQUFJLENBQUMsVUFBQ0MsQ0FBQyxF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LEtBQUssT0FBTztRQUNSM0YsY0FBYyxFQUFFO1FBQ2hCWixZQUFZLENBQUNlLFdBQVcsS0FBSztRQUM3QmxCLFFBQVEsQ0FBQ1MsS0FBSyxDQUFDMkMsT0FBTyxHQUFHLEdBQUc7UUFDNUJ4RCxhQUFhLENBQUNhLEtBQUssQ0FBQzJDLE9BQU8sR0FBRyxHQUFHO1FBQ2pDbkQsUUFBUSxDQUFDUSxLQUFLLENBQUNXLFNBQVMsR0FBRyxnQkFBZ0I7UUFDM0NsQixTQUFTLENBQUNPLEtBQUssQ0FBQ1csU0FBUyxHQUFHLDZCQUE2QjtRQUN6RDtJQUFNOztJQUdkO0lBQ0FwQyxRQUFRLENBQUNNLGFBQWEsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDbUIsS0FBSyxDQUFDbUcsT0FBTyxHQUFHLE1BQU07RUFDM0UsQ0FBQyxDQUFDO0FBQ04sQ0FBQyxDQUFDOztBQUVGO0FBQ0E1SCxRQUFRLENBQUN1RSxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsVUFBQ1AsQ0FBQyxFQUFLO0VBRXRDUSxPQUFPLENBQUNDLEdBQUcsQ0FBQ1QsQ0FBQyxDQUFDQyxNQUFNLENBQUM7RUFDckIsSUFBSSxDQUFDRCxDQUFDLENBQUNDLE1BQU0sQ0FBQzRELE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFO0lBQ3JDN0gsUUFBUSxDQUFDTSxhQUFhLENBQUMsd0JBQXdCLENBQUMsQ0FBQ21CLEtBQUssQ0FBQ21HLE9BQU8sR0FBRyxNQUFNO0VBQzNFLENBQUMsTUFBSTtJQUNENUgsUUFBUSxDQUFDTSxhQUFhLENBQUMsd0JBQXdCLENBQUMsQ0FBQ21CLEtBQUssQ0FBQ21HLE9BQU8sR0FBRyxPQUFPO0VBQzVFO0FBQ0osQ0FBQyxDQUFDIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBjZWxscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jZWxsJyk7XG5jb25zdCBzdGF0dXNUZXh0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N0YXR1cycpO1xuY29uc3Qgc3RhdHVzVGV4dEluZm8gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3RhdHVzLXRleHQnKTtcbmNvbnN0IHN0YXR1c0NvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubGFuZF9fbGVmdFwiKTtcbmNvbnN0IHN0YXR1c0JveCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubGFuZF9fc3RhdHVzXCIpO1xuY29uc3QgcmVzdGFydEJ0bnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucmVzdGFydC1nYW1lJyk7XG5jb25zdCBvdmVybGF5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5vdmVybGF5XCIpO1xuY29uc3Qgc2lkZUJ0bnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuc2lkZS1idG4nKTtcbmNvbnN0IHN0YXJ0R2FtZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zdGFydC1nYW1lJyk7XG5jb25zdCBnYW1lQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dhbWUnKTtcbmNvbnN0IGxhbmRXcmFwcGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmxhbmQnKTtcbmNvbnN0IHN0YXR1c0ljb25YID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtcGxheWVyPVwiWFwiXScpO1xuY29uc3Qgc3RhdHVzSWNvbk8gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1wbGF5ZXI9XCJPXCJdJyk7XG5jb25zdCBnYW1lR3JpZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5nYW1lLWdyaWQnKTtcbmNvbnN0IHBlcnNMZWZ0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmdhbWUtcGVycy5fbGVmdCcpO1xuY29uc3QgcGVyc1JpZ2h0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmdhbWUtcGVycy5fcmlnaHQnKTtcbmNvbnN0IGdhbWVPdmVyVGV4dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5nYW1lLW92ZXInKTtcblxubGV0IGJvYXJkID0gWycnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJyddO1xubGV0IGlzQ29tcHV0ZXJYID0gdHJ1ZTtcbmxldCBjdXJyZW50UGxheWVyLCBjb21wdXRlclBsYXllcjtcblxuZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9IFwiaGlkZGVuXCI7XG5cbmlmIChpc0NvbXB1dGVyWCkge1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXNpZGU9XCJYXCJdJykuY2xhc3NMaXN0LnJlbW92ZSgnX2FjdGl2ZScpO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXNpZGU9XCIwXCJdJykuY2xhc3NMaXN0LmFkZCgnX2FjdGl2ZScpO1xufSBlbHNlIHtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1zaWRlPVwiMFwiXScpLmNsYXNzTGlzdC5yZW1vdmUoJ19hY3RpdmUnKTtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1zaWRlPVwiWFwiXScpLmNsYXNzTGlzdC5hZGQoJ19hY3RpdmUnKTtcbn1cblxuY29uc3Qgd2lubmluZ0NvbWJvcyA9IFtcbiAgICBbMCwgMSwgMl0sXG4gICAgWzMsIDQsIDVdLFxuICAgIFs2LCA3LCA4XSxcbiAgICBbMCwgMywgNl0sXG4gICAgWzEsIDQsIDddLFxuICAgIFsyLCA1LCA4XSxcbiAgICBbMCwgNCwgOF0sXG4gICAgWzIsIDQsIDZdLFxuXTtcblxuZnVuY3Rpb24gaW5pdGlhbGl6ZUdhbWUoKSB7XG4gICAgY3VycmVudFBsYXllciA9IGlzQ29tcHV0ZXJYID8gJ9CT0YDQsNCy0LXRhtGMIDAyJyA6ICfQk9GA0LDQstC10YbRjCAwMSc7XG4gICAgY29tcHV0ZXJQbGF5ZXIgPSBpc0NvbXB1dGVyWCA/ICfQk9GA0LDQstC10YbRjCAwMScgOiAn0JPRgNCw0LLQtdGG0YwgMDInO1xuICAgIGJvYXJkID0gWycnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJyddO1xuICAgIGNlbGxzLmZvckVhY2goY2VsbCA9PiB7XG4gICAgICAgIGNlbGwudGV4dENvbnRlbnQgPSAnJztcbiAgICAgICAgY2VsbC5jbGFzc0xpc3QucmVtb3ZlKCd0YWtlbicsICdYLXBsYXllcicsICdPLXBsYXllcicpO1xuICAgIH0pO1xuXG4gICAgY29uc3QgbGluZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy53aW4tbGluZScpO1xuICAgIGlmIChsaW5lKSB7XG4gICAgICAgIGxpbmUuc3R5bGUudHJhbnNmb3JtID0gJ3NjYWxlWCgwKSc7XG4gICAgfVxuXG4gICAgY2hlY2tTdGF0dXNJY29uKGN1cnJlbnRQbGF5ZXIpO1xuICAgIGNoZWNrU3RhdHVzQ29udGFpbmVyKGN1cnJlbnRQbGF5ZXIpO1xuXG4gICAgc3RhdHVzVGV4dC50ZXh0Q29udGVudCA9IGAke2N1cnJlbnRQbGF5ZXJ9YDtcbiAgICBzdGF0dXNUZXh0SW5mby50ZXh0Q29udGVudCA9IGDQotCS0IbQmV/QpdCG0JRgO1xuICAgIGlmIChjdXJyZW50UGxheWVyID09PSBjb21wdXRlclBsYXllcikge1xuICAgICAgICBzZXRUaW1lb3V0KGJlc3RNb3ZlLCA1MDApO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gY2hlY2tTdGF0dXNJY29uKHBsYXllcikge1xuICAgIGlmIChwbGF5ZXIgPT09ICfQk9GA0LDQstC10YbRjCAwMScpIHtcbiAgICAgICAgc3RhdHVzSWNvblguY2xhc3NMaXN0LmFkZChcIl9hY3RpdmVcIik7XG4gICAgICAgIHN0YXR1c0ljb25PLmNsYXNzTGlzdC5yZW1vdmUoXCJfYWN0aXZlXCIpO1xuICAgIH1cbiAgICBpZiAocGxheWVyID09PSAn0JPRgNCw0LLQtdGG0YwgMDInKSB7XG4gICAgICAgIHN0YXR1c0ljb25PLmNsYXNzTGlzdC5hZGQoXCJfYWN0aXZlXCIpO1xuICAgICAgICBzdGF0dXNJY29uWC5jbGFzc0xpc3QucmVtb3ZlKFwiX2FjdGl2ZVwiKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGNoZWNrU3RhdHVzQ29udGFpbmVyKHBsYXllcikge1xuICAgIGlmIChwbGF5ZXIgPT09ICfQk9GA0LDQstC10YbRjCAwMScpIHtcbiAgICAgICAgc3RhdHVzQm94LmNsYXNzTGlzdC5hZGQoXCJYLXBsYXllclwiKTtcbiAgICAgICAgc3RhdHVzQm94LmNsYXNzTGlzdC5yZW1vdmUoXCJPLXBsYXllclwiKTtcbiAgICB9XG4gICAgaWYgKHBsYXllciA9PT0gJ9CT0YDQsNCy0LXRhtGMIDAyJykge1xuICAgICAgICBzdGF0dXNCb3guY2xhc3NMaXN0LmFkZChcIk8tcGxheWVyXCIpO1xuICAgICAgICBzdGF0dXNCb3guY2xhc3NMaXN0LnJlbW92ZShcIlgtcGxheWVyXCIpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gY2hlY2tXaW5uZXIocGxheWVyKSB7XG4gICAgZm9yIChjb25zdCBjb21ibyBvZiB3aW5uaW5nQ29tYm9zKSB7XG4gICAgICAgIGlmIChjb21iby5ldmVyeShpbmRleCA9PiBib2FyZFtpbmRleF0gPT09IHBsYXllcikpIHtcbiAgICAgICAgICAgIHJldHVybiBjb21ibztcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbn1cblxuZnVuY3Rpb24gaXNEcmF3KCkge1xuICAgIHJldHVybiBib2FyZC5ldmVyeShjZWxsID0+IGNlbGwgIT09ICcnKTtcbn1cblxuZnVuY3Rpb24gYmVzdE1vdmUoKSB7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGxldCBiZXN0U2NvcmUgPSAtSW5maW5pdHk7XG4gICAgICAgIGxldCBtb3ZlO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYm9hcmQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChib2FyZFtpXSA9PT0gJycpIHtcbiAgICAgICAgICAgICAgICBib2FyZFtpXSA9IGNvbXB1dGVyUGxheWVyO1xuICAgICAgICAgICAgICAgIGxldCBzY29yZSA9IG1pbmltYXgoYm9hcmQsIDAsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICBib2FyZFtpXSA9ICcnO1xuICAgICAgICAgICAgICAgIGlmIChzY29yZSA+IGJlc3RTY29yZSkge1xuICAgICAgICAgICAgICAgICAgICBiZXN0U2NvcmUgPSBzY29yZTtcbiAgICAgICAgICAgICAgICAgICAgbW92ZSA9IGk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgYm9hcmRbbW92ZV0gPSBjb21wdXRlclBsYXllcjtcblxuICAgICAgICBpZiAoY29tcHV0ZXJQbGF5ZXIgPT09IFwi0JPRgNCw0LLQtdGG0YwgMDJcIikge1xuICAgICAgICAgICAgY2VsbHNbbW92ZV0uY2xhc3NMaXN0LmFkZCgnTy1wbGF5ZXInKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY29tcHV0ZXJQbGF5ZXIgPT09IFwi0JPRgNCw0LLQtdGG0YwgMDFcIikge1xuICAgICAgICAgICAgY2VsbHNbbW92ZV0uY2xhc3NMaXN0LmFkZCgnWC1wbGF5ZXInKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNoZWNrU3RhdHVzSWNvbihjb21wdXRlclBsYXllcik7XG4gICAgICAgIGNoZWNrU3RhdHVzQ29udGFpbmVyKGN1cnJlbnRQbGF5ZXIpO1xuICAgICAgICBzdGF0dXNUZXh0SW5mby50ZXh0Q29udGVudCA9IGDQp9CV0JrQkNCZYDtcblxuICAgICAgICBjZWxsc1ttb3ZlXS5jbGFzc0xpc3QuYWRkKCd0YWtlbicpO1xuXG4gICAgICAgIGNvbnN0IHdpbm5pbmdDb21ibyA9IGNoZWNrV2lubmVyKGNvbXB1dGVyUGxheWVyKTtcbiAgICAgICAgaWYgKHdpbm5pbmdDb21ibykge1xuICAgICAgICAgICAgc2hvd1dpbkxpbmUod2lubmluZ0NvbWJvKTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT57XG4gICAgICAgICAgICAgICAgc3RhdHVzVGV4dC50ZXh0Q29udGVudCA9IGAke2NvbXB1dGVyUGxheWVyfWA7XG4gICAgICAgICAgICAgICAgaGlkZUFmdGVyR2FtZShcImxvc2VcIilcbiAgICAgICAgICAgICAgICBlbmRHYW1lKCk7XG4gICAgICAgICAgICB9LCAxMDAwKVxuICAgICAgICB9IGVsc2UgaWYgKGlzRHJhdygpKSB7XG4gICAgICAgICAgICBoaWRlQWZ0ZXJHYW1lKFwiZHJhd1wiKVxuICAgICAgICAgICAgc3RhdHVzVGV4dC50ZXh0Q29udGVudCA9IFwi0J3RltGH0LjRjyFcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRQbGF5ZXIgPSBjdXJyZW50UGxheWVyID09PSAn0JPRgNCw0LLQtdGG0YwgMDEnID8gJ9CT0YDQsNCy0LXRhtGMIDAyJyA6ICfQk9GA0LDQstC10YbRjCAwMSc7XG4gICAgICAgICAgICAgICAgY2hlY2tTdGF0dXNJY29uKGN1cnJlbnRQbGF5ZXIpO1xuICAgICAgICAgICAgICAgIGNoZWNrU3RhdHVzQ29udGFpbmVyKGN1cnJlbnRQbGF5ZXIpO1xuICAgICAgICAgICAgICAgIHN0YXR1c1RleHRJbmZvLnRleHRDb250ZW50ID0gYNCi0JLQhtCZX9Cl0IbQlGA7XG4gICAgICAgICAgICAgICAgc3RhdHVzVGV4dC50ZXh0Q29udGVudCA9IGAke2N1cnJlbnRQbGF5ZXJ9YDtcbiAgICAgICAgICAgIH0sIDE1MDApO1xuICAgICAgICB9XG4gICAgfSwgMTAwMCk7XG59XG5cbmZ1bmN0aW9uIG1pbmltYXgoYm9hcmQsIGRlcHRoLCBpc01heGltaXppbmcpIHtcbiAgICBpZiAoY2hlY2tXaW5uZXIoY29tcHV0ZXJQbGF5ZXIpKSByZXR1cm4gMTAgLSBkZXB0aDtcbiAgICBpZiAoY2hlY2tXaW5uZXIoY3VycmVudFBsYXllcikpIHJldHVybiBkZXB0aCAtIDEwO1xuICAgIGlmIChpc0RyYXcoKSkgcmV0dXJuIDA7XG5cbiAgICBpZiAoaXNNYXhpbWl6aW5nKSB7XG4gICAgICAgIGxldCBiZXN0U2NvcmUgPSAtSW5maW5pdHk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYm9hcmQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChib2FyZFtpXSA9PT0gJycpIHtcbiAgICAgICAgICAgICAgICBib2FyZFtpXSA9IGNvbXB1dGVyUGxheWVyO1xuICAgICAgICAgICAgICAgIGxldCBzY29yZSA9IG1pbmltYXgoYm9hcmQsIGRlcHRoICsgMSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIGJvYXJkW2ldID0gJyc7XG4gICAgICAgICAgICAgICAgYmVzdFNjb3JlID0gTWF0aC5tYXgoc2NvcmUsIGJlc3RTY29yZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGJlc3RTY29yZTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgYmVzdFNjb3JlID0gSW5maW5pdHk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYm9hcmQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChib2FyZFtpXSA9PT0gJycpIHtcbiAgICAgICAgICAgICAgICBib2FyZFtpXSA9IGN1cnJlbnRQbGF5ZXI7XG4gICAgICAgICAgICAgICAgbGV0IHNjb3JlID0gbWluaW1heChib2FyZCwgZGVwdGggKyAxLCB0cnVlKTtcbiAgICAgICAgICAgICAgICBib2FyZFtpXSA9ICcnO1xuICAgICAgICAgICAgICAgIGJlc3RTY29yZSA9IE1hdGgubWluKHNjb3JlLCBiZXN0U2NvcmUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBiZXN0U2NvcmU7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBoYW5kbGVDZWxsQ2xpY2soZSkge1xuICAgIGNvbnN0IGNlbGwgPSBlLnRhcmdldDtcbiAgICBjb25zdCBpbmRleCA9IGNlbGwuZGF0YXNldC5pbmRleDtcblxuICAgIGlmIChib2FyZFtpbmRleF0gPT09ICcnICYmIGN1cnJlbnRQbGF5ZXIgIT09IGNvbXB1dGVyUGxheWVyKSB7XG4gICAgICAgIGJvYXJkW2luZGV4XSA9IGN1cnJlbnRQbGF5ZXI7XG5cbiAgICAgICAgaWYgKGN1cnJlbnRQbGF5ZXIgPT09IFwi0JPRgNCw0LLQtdGG0YwgMDJcIikge1xuICAgICAgICAgICAgY2VsbC5jbGFzc0xpc3QuYWRkKCdPLXBsYXllcicpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjdXJyZW50UGxheWVyID09PSBcItCT0YDQsNCy0LXRhtGMIDAxXCIpIHtcbiAgICAgICAgICAgIGNlbGwuY2xhc3NMaXN0LmFkZCgnWC1wbGF5ZXInKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNlbGwuY2xhc3NMaXN0LmFkZCgndGFrZW4nKTtcblxuICAgICAgICBjb25zdCB3aW5uaW5nQ29tYm8gPSBjaGVja1dpbm5lcihjdXJyZW50UGxheWVyKTtcbiAgICAgICAgaWYgKHdpbm5pbmdDb21ibykge1xuICAgICAgICAgICAgc2hvd1dpbkxpbmUod2lubmluZ0NvbWJvKTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHN0YXR1c1RleHQudGV4dENvbnRlbnQgPSBgJHtjdXJyZW50UGxheWVyfWA7XG4gICAgICAgICAgICAgICAgaGlkZUFmdGVyR2FtZShcIndpblwiKVxuICAgICAgICAgICAgICAgIGVuZEdhbWUoKTtcbiAgICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICB9IGVsc2UgaWYgKGlzRHJhdygpKSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICBoaWRlQWZ0ZXJHYW1lKFwiZHJhd1wiKVxuICAgICAgICAgICAgICAgIHN0YXR1c1RleHQudGV4dENvbnRlbnQgPSBcItCd0ZbRh9C40Y8hXCI7XG4gICAgICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGN1cnJlbnRQbGF5ZXIgPSBjb21wdXRlclBsYXllcjtcbiAgICAgICAgICAgIHN0YXR1c1RleHQudGV4dENvbnRlbnQgPSBgJHtjb21wdXRlclBsYXllcn1gO1xuICAgICAgICAgICAgc2V0VGltZW91dChiZXN0TW92ZSwgNTAwKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gaGlkZUFmdGVyR2FtZSh3aW5uZXIpe1xuICAgIGdhbWVDb250YWluZXIuc3R5bGUub3BhY2l0eSA9IFwiMFwiO1xuICAgIGdhbWVHcmlkLnN0eWxlLm9wYWNpdHkgPSBcIjBcIjtcbiAgICBzdGF0dXNCb3guY2xhc3NMaXN0LnJlbW92ZShcIk8tcGxheWVyXCIsIFwiWC1wbGF5ZXJcIik7XG4gICAgcGVyc0xlZnQuc3R5bGUudHJhbnNmb3JtID0gXCJ0cmFuc2xhdGVYKDIyMCUpXCI7XG4gICAgcGVyc1JpZ2h0LnN0eWxlLnRyYW5zZm9ybSA9IFwidHJhbnNsYXRlWCgtMjIwJSkgc2NhbGUoLTEsIDEpXCI7XG5cblxuXG4gICAgaWYod2lubmVyID09PSBcImxvc2VcIil7XG4gICAgICAgIGdhbWVPdmVyVGV4dC50ZXh0Q29udGVudCA9IFwi0L3QtSDQv9C+0YnQsNGB0YLQuNC70L4hXCJcbiAgICB9XG4gICAgaWYod2lubmVyID09PSBcIndpblwiKXtcbiAgICAgICAgZ2FtZU92ZXJUZXh0LnRleHRDb250ZW50ID0gXCLRgtC4INC/0LXRgNC10LzRltCzIVwiXG4gICAgfVxuICAgIGlmKHdpbm5lciA9PT0gXCJkcmF3XCIpe1xuICAgICAgICBnYW1lT3ZlclRleHQudGV4dENvbnRlbnQgPSBcItGC0Lgg0LHRg9CyINC90LAg0YDRltCy0L3RliFcIlxuICAgIH1cblxuICAgIHNldFRpbWVvdXQoKCkgPT57XG4gICAgICAgIGdhbWVPdmVyVGV4dC5jbGFzc0xpc3QucmVtb3ZlKFwib3BhY2l0eVwiKVxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+e1xuICAgICAgICAgICAgaWYod2lubmVyID09PSBcImRyYXdcIil7XG4gICAgICAgICAgICAgICAgc2hvd1BvcHVwKFwiLl9kcmF3XCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYod2lubmVyID09PSBcIndpblwiKXtcbiAgICAgICAgICAgICAgICBzaG93UG9wdXAoXCIuX3dpblwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKHdpbm5lciA9PT0gXCJsb3NlXCIpe1xuICAgICAgICAgICAgICAgIHNob3dQb3B1cChcIi5fbG9zZVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgNTAwKVxuXG4gICAgfSwgMTAwMClcblxufVxuXG5mdW5jdGlvbiBlbmRHYW1lKCkge1xuICAgIGNlbGxzLmZvckVhY2goY2VsbCA9PiBjZWxsLmNsYXNzTGlzdC5hZGQoJ3Rha2VuJykpO1xufVxuXG5yZXN0YXJ0QnRucy5mb3JFYWNoKGJ0biA9PntcbiAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgICBpc0NvbXB1dGVyWCA9ICFpc0NvbXB1dGVyWDtcbiAgICAgICAgICAgIGluaXRpYWxpemVHYW1lKCk7XG4gICAgICAgICAgICBnYW1lT3ZlclRleHQudGV4dENvbnRlbnQgPSBgYDtcbiAgICAgICAgICAgIGdhbWVHcmlkLnN0eWxlLm9wYWNpdHkgPSBcIjFcIjtcbiAgICAgICAgICAgIGdhbWVDb250YWluZXIuc3R5bGUub3BhY2l0eSA9IFwiMVwiO1xuICAgICAgICAgICAgcGVyc0xlZnQuc3R5bGUudHJhbnNmb3JtID0gXCJ0cmFuc2xhdGVYKDAlKVwiO1xuICAgICAgICAgICAgcGVyc1JpZ2h0LnN0eWxlLnRyYW5zZm9ybSA9IFwidHJhbnNsYXRlWCgwJSkgc2NhbGUoLTEsIDEpXCI7XG4gICAgICAgICAgICBzaWRlQnRucy5mb3JFYWNoKGJ0biA9PiB7XG4gICAgICAgICAgICAgICAgYnRuLmNsYXNzTGlzdC5yZW1vdmUoXCJfYWN0aXZlXCIpXG4gICAgICAgICAgICAgICAgc3RhcnRHYW1lLmNsYXNzTGlzdC5hZGQoXCJkaXNhYmxlZFwiKTtcbiAgICAgICAgICAgICAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGlzQ29tcHV0ZXJYKTtcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRHYW1lLmNsYXNzTGlzdC5yZW1vdmUoXCJkaXNhYmxlZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2lkZSA9IGJ0bi5kYXRhc2V0LnNpZGU7XG4gICAgICAgICAgICAgICAgICAgIGlzQ29tcHV0ZXJYID0gc2lkZSAhPT0gJ1gnO1xuICAgICAgICAgICAgICAgICAgICBzaWRlQnRucy5mb3JFYWNoKGl0ZW0gPT4gaXRlbS5jbGFzc0xpc3QucmVtb3ZlKCdfYWN0aXZlJykpO1xuICAgICAgICAgICAgICAgICAgICBidG4uY2xhc3NMaXN0LmFkZCgnX2FjdGl2ZScpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIGRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSBcImF1dG9cIjtcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIucG9wdXBcIikuZm9yRWFjaChwb3B1cCA9PiB7XG4gICAgICAgICAgICAgICAgaWYocG9wdXAuY2xhc3NMaXN0LmNvbnRhaW5zKCdfc3RhcnQnKSl7XG4gICAgICAgICAgICAgICAgICAgIHBvcHVwLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUtcG9wdXAnKTtcbiAgICAgICAgICAgICAgICAgICAgcG9wdXAuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpO1xuICAgICAgICAgICAgICAgICAgICBwb3B1cC5zdHlsZS5vcGFjaXR5ID0gXCIxXCI7XG4gICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgIHBvcHVwLmNsYXNzTGlzdC5hZGQoJ2hpZGUtcG9wdXAnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9KTtcbn0pXG5cbmNlbGxzLmZvckVhY2goY2VsbCA9PiBjZWxsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgaGFuZGxlQ2VsbENsaWNrKSk7XG5cbnNpZGVCdG5zLmZvckVhY2goYnRuID0+IHtcbiAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHNpZGUgPSBidG4uZGF0YXNldC5zaWRlO1xuICAgICAgICBpc0NvbXB1dGVyWCA9IHNpZGUgIT09ICdYJztcbiAgICAgICAgc2lkZUJ0bnMuZm9yRWFjaChpdGVtID0+IGl0ZW0uY2xhc3NMaXN0LnJlbW92ZSgnX2FjdGl2ZScpKTtcbiAgICAgICAgYnRuLmNsYXNzTGlzdC5hZGQoJ19hY3RpdmUnKTtcbiAgICB9KTtcbn0pO1xuXG5zdGFydEdhbWUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NpZGUtc2VsZWN0aW9uJykuc3R5bGUub3BhY2l0eSA9ICcwJztcbiAgICBnYW1lQ29udGFpbmVyLnN0eWxlLm9wYWNpdHkgPSAnMSc7XG4gICAgbGFuZFdyYXBwZXIuY2xhc3NMaXN0LmFkZChcIl9kZWNvclwiKTtcbiAgICBkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gXCJhdXRvXCI7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGVuYWJsZU1vdXNlU2NhbGUoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmRlY29yJykpO1xuICAgIH0sIDI1MDApO1xuICAgIGluaXRpYWxpemVHYW1lKCk7XG4gICAgaGlkZVBvcHVwKFwiI3NpZGUtc2VsZWN0aW9uXCIpO1xufSk7XG5cbmZ1bmN0aW9uIHNob3dQb3B1cChwb3B1cCkge1xuXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHBvcHVwID0gb3ZlcmxheS5xdWVyeVNlbGVjdG9yKHBvcHVwKTtcbiAgICAgICAgb3ZlcmxheS5jbGFzc0xpc3QucmVtb3ZlKFwib3BhY2l0eVwiKTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9IFwiaGlkZGVuXCI7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT57XG4gICAgICAgICAgICBwb3B1cC5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZS1wb3B1cFwiKTtcbiAgICAgICAgfSwgNTAwKVxuICAgIH0sIDIwMDApXG5cbn1cblxuZnVuY3Rpb24gaGlkZVBvcHVwKHBvcHVwKSB7XG4gICAgcG9wdXAgPSBvdmVybGF5LnF1ZXJ5U2VsZWN0b3IocG9wdXApO1xuICAgIG92ZXJsYXkuY2xhc3NMaXN0LmFkZChcIm9wYWNpdHlcIik7XG4gICAgcG9wdXAuY2xhc3NMaXN0LmFkZChcImhpZGVcIik7XG59XG5cbmZ1bmN0aW9uIGVuYWJsZU1vdXNlU2NhbGUoZWxlbWVudCkge1xuICAgIGNvbnN0IG1pblNjYWxlID0gMTtcbiAgICBjb25zdCBtYXhTY2FsZSA9IDEuMDU7XG4gICAgZWxlbWVudC5zdHlsZS50cmFuc2l0aW9uID0gJ3RyYW5zZm9ybSAwLjFzIGVhc2UnO1xuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgKGUpID0+IHtcbiAgICAgICAgY29uc3QgcmVjdCA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIGNvbnN0IHggPSBlLmNsaWVudFggLSByZWN0LmxlZnQ7XG4gICAgICAgIGNvbnN0IHkgPSBlLmNsaWVudFkgLSByZWN0LnRvcDtcbiAgICAgICAgY29uc3QgY2VudGVyWCA9IHJlY3Qud2lkdGggLyAyO1xuICAgICAgICBjb25zdCBjZW50ZXJZID0gcmVjdC5oZWlnaHQgLyAyO1xuICAgICAgICBjb25zdCBkaXN0YW5jZSA9IE1hdGguaHlwb3QoeCAtIGNlbnRlclgsIHkgLSBjZW50ZXJZKTtcbiAgICAgICAgY29uc3QgbWF4RGlzdGFuY2UgPSBNYXRoLmh5cG90KGNlbnRlclgsIGNlbnRlclkpO1xuICAgICAgICBjb25zdCBzY2FsZSA9IG1pblNjYWxlICsgKDEgLSBkaXN0YW5jZSAvIG1heERpc3RhbmNlKSAqIChtYXhTY2FsZSAtIG1pblNjYWxlKTtcbiAgICAgICAgZWxlbWVudC5zdHlsZS50cmFuc2Zvcm0gPSBgc2NhbGUoJHtNYXRoLm1pbihtYXhTY2FsZSwgTWF0aC5tYXgobWluU2NhbGUsIHNjYWxlKSl9KWA7XG4gICAgfSk7XG5cbiAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCAoKSA9PiB7XG4gICAgICAgIGVsZW1lbnQuc3R5bGUudHJhbnNmb3JtID0gYHNjYWxlKCR7bWluU2NhbGV9KWA7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIHNob3dXaW5MaW5lKGNvbWJvKSB7XG4gICAgY29uc3QgbGluZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy53aW4tbGluZScpO1xuICAgIGxpbmUuc3R5bGUudHJhbnNmb3JtID0gJ3NjYWxlWCgwKSc7XG4gICAgLy8gbGluZS5zdHlsZS53aWR0aCA9ICcxMDAlJztcbiAgICAvLyBsaW5lLnN0eWxlLmhlaWdodCA9ICc0NHB4JztcbiAgICAvLyBsaW5lLnN0eWxlLmJhY2tncm91bmQgPSAnIzAwZjBmZic7XG5cbiAgICBjb25zdCBwb3NpdGlvbnMgPSB7XG4gICAgICAgICcwLDEsMic6IHsgdG9wOiAnMjYlJywgbGVmdDogJzUwJScsIHJvdGF0ZTogJzBkZWcnLCB3aWR0aDogJzgwJScgfSxcbiAgICAgICAgJzMsNCw1JzogeyB0b3A6ICc1MCUnLCBsZWZ0OiAnNTAlJywgcm90YXRlOiAnMGRlZycsIHdpZHRoOiAnODAlJyB9LFxuICAgICAgICAnNiw3LDgnOiB7IHRvcDogJzc4LjMzJScsIGxlZnQ6ICc1MCUnLCByb3RhdGU6ICcwZGVnJywgd2lkdGg6ICc4MCUnIH0sXG4gICAgICAgICcwLDMsNic6IHsgdG9wOiAnNTAlJywgbGVmdDogJzI0LjUlJywgcm90YXRlOiAnOTBkZWcnLCB3aWR0aDogJzgwJSd9LFxuICAgICAgICAnMSw0LDcnOiB7IHRvcDogJzUwJScsIGxlZnQ6ICc1MCUnLCByb3RhdGU6ICc5MGRlZycsIHdpZHRoOiAnODAlJyB9LFxuICAgICAgICAnMiw1LDgnOiB7IHRvcDogJzUwJScsIGxlZnQ6ICc3Ni41JScsIHJvdGF0ZTogJzkwZGVnJywgd2lkdGg6ICc4MCUnIH0sXG4gICAgICAgICcwLDQsOCc6IHsgdG9wOiAnNTAlJywgbGVmdDogJzUwJScsIHJvdGF0ZTogJzQ1ZGVnJywgd2lkdGg6ICcxMDAlJyB9LFxuICAgICAgICAnMiw0LDYnOiB7IHRvcDogJzUwJScsIGxlZnQ6ICc1MCUnLCByb3RhdGU6ICctNDVkZWcnLCB3aWR0aDogJzEwMCUnIH0sXG4gICAgfTtcblxuICAgIGNvbnN0IGtleSA9IGNvbWJvLnNvcnQoKGEsIGIpID0+IGEgLSBiKS5qb2luKCcsJyk7XG5cbiAgICBjb25zb2xlLmxvZyhrZXkpO1xuXG4gICAgY29uc3QgcG9zID0gcG9zaXRpb25zW2tleV07XG5cbiAgICBjb25zb2xlLmxvZyhwb3Mud2lkdGgpO1xuXG4gICAgbGV0IHdpZHRoID0gcG9zLndpZHRoO1xuXG4gICAgaWYgKHBvcykge1xuICAgICAgICBsaW5lLnN0eWxlLnRvcCA9IHBvcy50b3A7XG4gICAgICAgIGxpbmUuc3R5bGUubGVmdCA9IHBvcy5sZWZ0O1xuICAgICAgICBsaW5lLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGUoLTUwJSwgLTUwJSkgcm90YXRlKCR7cG9zLnJvdGF0ZX0pIHNjYWxlWCgxKWA7XG4gICAgICAgIGxpbmUuc3R5bGUud2lkdGggPSBgJHtwb3Mud2lkdGh9YDtcbiAgICAgICAgbGluZS5zdHlsZS5vcGFjaXR5ID0gYDFgO1xuICAgIH1cbn1cblxuLy8gdGVzdFxuY29uc3QgdGVzdFBvcHVwQnV0dG9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50ZXN0LXBvcHVwJyk7XG50ZXN0UG9wdXBCdXR0b25zLmZvckVhY2goYnV0dG9uID0+IHtcbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHBvcHVwQ2xhc3MgPSBidXR0b24uZGF0YXNldC5wb3B1cDtcbiAgICAgICAgY29uc3QgcG9wdXAgPSBvdmVybGF5LnF1ZXJ5U2VsZWN0b3IocG9wdXBDbGFzcyk7XG4gICAgICAgIGNvbnN0IGFsbFBvcHVwcyA9IG92ZXJsYXkucXVlcnlTZWxlY3RvckFsbCgnLnBvcHVwJyk7XG4gICAgICAgIGNvbnN0IGlzQWxyZWFkeU9wZW4gPSAhcG9wdXAuY2xhc3NMaXN0LmNvbnRhaW5zKCdoaWRlLXBvcHVwJyk7XG5cbiAgICAgICAgaWYgKGlzQWxyZWFkeU9wZW4pIHtcbiAgICAgICAgICAgIG92ZXJsYXkuY2xhc3NMaXN0LmFkZCgnb3BhY2l0eScpO1xuICAgICAgICAgICAgcG9wdXAuY2xhc3NMaXN0LmFkZCgnaGlkZS1wb3B1cCcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYWxsUG9wdXBzLmZvckVhY2gocCA9PiBwLmNsYXNzTGlzdC5hZGQoJ2hpZGUtcG9wdXAnKSk7XG4gICAgICAgICAgICBvdmVybGF5LmNsYXNzTGlzdC5yZW1vdmUoJ29wYWNpdHknKTtcbiAgICAgICAgICAgIHBvcHVwLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUtcG9wdXAnKTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7XG5cblxuLy8g0JTQvtC00LDRlNC80L4g0YbQtdC5INC60L7QtCDQsiDQutGW0L3QtdGG0Ywg0LLQsNGI0L7Qs9C+INGW0YHQvdGD0Y7Rh9C+0LPQviDRgdC60YDQuNC/0YLQsFxuXG4vLyDQodGC0LLQvtGA0Y7RlNC80L4g0LLQuNC/0LDQtNCw0Y7Rh9C1INC80LXQvdGOINC00LvRjyDRgtC10YHRgtC+0LLQuNGFINGB0YbQtdC90LDRgNGW0ZfQslxuY29uc3QgdGVzdE1lbnUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbnRlc3RNZW51LmNsYXNzTmFtZSA9ICd0ZXN0LWRyb3Bkb3duJztcbnRlc3RNZW51LmlubmVySFRNTCA9IGBcbiAgPGJ1dHRvbiBjbGFzcz1cInRlc3QtZHJvcGRvd24tYnRuXCI+0KLQtdGB0YIg0YHRhtC10L3QsNGA0ZbRl9CyIOKWvDwvYnV0dG9uPlxuICA8ZGl2IGNsYXNzPVwidGVzdC1kcm9wZG93bi1jb250ZW50XCI+XG4gICAgPGJ1dHRvbiBjbGFzcz1cInRlc3Qtc2NlbmFyaW9cIiBkYXRhLXNjZW5hcmlvPVwid2luXCI+0KLQtdGB0YIgV2luPC9idXR0b24+XG4gICAgPGJ1dHRvbiBjbGFzcz1cInRlc3Qtc2NlbmFyaW9cIiBkYXRhLXNjZW5hcmlvPVwibG9zZVwiPtCi0LXRgdGCIExvc2U8L2J1dHRvbj5cbiAgICA8YnV0dG9uIGNsYXNzPVwidGVzdC1zY2VuYXJpb1wiIGRhdGEtc2NlbmFyaW89XCJkcmF3XCI+0KLQtdGB0YIgRHJhdzwvYnV0dG9uPlxuICAgIDxidXR0b24gY2xhc3M9XCJ0ZXN0LXNjZW5hcmlvXCIgZGF0YS1zY2VuYXJpbz1cInJlc2V0XCI+0KHQutC40L3Rg9GC0Lgg0LPRgNGDPC9idXR0b24+XG4gIDwvZGl2PlxuYDtcblxuLy8g0JTQvtC00LDRlNC80L4g0YHRgtC40LvRliDQtNC70Y8g0LLQuNC/0LDQtNCw0Y7Rh9C+0LPQviDQvNC10L3RjlxuY29uc3Qgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuc3R5bGUudGV4dENvbnRlbnQgPSBgXG4gIC50ZXN0LWRyb3Bkb3duIHtcbiAgICB6LWluZGV4OiA5OTk5O1xuICB9XG4gIFxuICAudGVzdC1kcm9wZG93bi1idG4ge1xuICAgIGJhY2tncm91bmQtY29sb3I6ICM0Q0FGNTA7XG4gICAgY29sb3I6IHdoaXRlO1xuICAgIHBhZGRpbmc6IDEwcHg7XG4gICAgZm9udC1zaXplOiAxNnB4O1xuICAgIGJvcmRlcjogbm9uZTtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgYm9yZGVyLXJhZGl1czogNHB4O1xuICB9XG4gIFxuICAudGVzdC1kcm9wZG93bi1jb250ZW50IHtcbiAgICBkaXNwbGF5OiBub25lO1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjlmOWY5O1xuICAgIG1pbi13aWR0aDogMTYwcHg7XG4gICAgYm94LXNoYWRvdzogMHB4IDhweCAxNnB4IDBweCByZ2JhKDAsMCwwLDAuMik7XG4gICAgei1pbmRleDogMTtcbiAgICBib3JkZXItcmFkaXVzOiA0cHg7XG4gICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgfVxuICBcbiAgLnRlc3QtZHJvcGRvd24tY29udGVudCBidXR0b24ge1xuICAgIGNvbG9yOiBibGFjaztcbiAgICBwYWRkaW5nOiAxMnB4IDE2cHg7XG4gICAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xuICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgIHdpZHRoOiAxMDAlO1xuICAgIHRleHQtYWxpZ246IGxlZnQ7XG4gICAgYm9yZGVyOiBub25lO1xuICAgIGJhY2tncm91bmQ6IG5vbmU7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICB9XG4gIFxuICAudGVzdC1kcm9wZG93bi1jb250ZW50IGJ1dHRvbjpob3ZlciB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2YxZjFmMTtcbiAgfVxuICBcbiAgLnRlc3QtZHJvcGRvd246aG92ZXIgLnRlc3QtZHJvcGRvd24tY29udGVudCB7XG4gICAgZGlzcGxheTogYmxvY2s7XG4gIH1cbmA7XG5cbmRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi50ZXN0LW1lbnVcIikuYXBwZW5kQ2hpbGQodGVzdE1lbnUpO1xuXG4vLyDQpNGD0L3QutGG0ZbRjyDQtNC70Y8g0YHQuNC80YPQu9GP0YbRltGXINCy0LjQs9GA0LDRiNGDXG5mdW5jdGlvbiBzaW11bGF0ZVdpbigpIHtcbiAgICAvLyDQntGH0LjRidCw0ZTQvNC+INC00L7RiNC60YNcbiAgICBib2FyZCA9IFsnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnXTtcblxuICAgIC8vINCS0YHRgtCw0L3QvtCy0LvRjtGU0LzQviDQstC40LPRgNCw0YjQvdGDINC60L7QvNCx0ZbQvdCw0YbRltGOINC00LvRjyDQs9GA0LDQstGG0Y9cbiAgICBib2FyZFswXSA9ICfQk9GA0LDQstC10YbRjCAwMSc7XG4gICAgYm9hcmRbMV0gPSAn0JPRgNCw0LLQtdGG0YwgMDEnO1xuICAgIGJvYXJkWzJdID0gJ9CT0YDQsNCy0LXRhtGMIDAxJztcblxuICAgIC8vINCe0L3QvtCy0LvRjtGU0LzQviBVSVxuICAgIGNlbGxzLmZvckVhY2goKGNlbGwsIGluZGV4KSA9PiB7XG4gICAgICAgIC8vIGNlbGwudGV4dENvbnRlbnQgPSAnJztcbiAgICAgICAgY2VsbC5jbGFzc0xpc3QucmVtb3ZlKCd0YWtlbicsICdYLXBsYXllcicsICdPLXBsYXllcicpO1xuXG4gICAgICAgIGlmIChib2FyZFtpbmRleF0gPT09ICfQk9GA0LDQstC10YbRjCAwMScpIHtcbiAgICAgICAgICAgIC8vIGNlbGwudGV4dENvbnRlbnQgPSAnWCc7XG4gICAgICAgICAgICBjZWxsLmNsYXNzTGlzdC5hZGQoJ1gtcGxheWVyJywgJ3Rha2VuJyk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vINCf0L7QutCw0LfRg9GU0LzQviDQu9GW0L3RltGOINC/0LXRgNC10LzQvtCz0LhcbiAgICBzaG93V2luTGluZShbMCwgMSwgMl0pO1xuXG4gICAgLy8g0JfQsNC/0YPRgdC60LDRlNC80L4g0LDQvdGW0LzQsNGG0ZbRjiDQt9Cw0LLQtdGA0YjQtdC90L3RjyDQs9GA0LhcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgc3RhdHVzVGV4dC50ZXh0Q29udGVudCA9ICfQk9GA0LDQstC10YbRjCAwMSc7XG4gICAgICAgIGhpZGVBZnRlckdhbWUoXCJ3aW5cIik7XG4gICAgICAgIGVuZEdhbWUoKTtcbiAgICB9LCAxMDAwKTtcbn1cblxuLy8g0KTRg9C90LrRhtGW0Y8g0LTQu9GPINGB0LjQvNGD0LvRj9GG0ZbRlyDQv9GA0L7Qs9GA0LDRiNGDXG5mdW5jdGlvbiBzaW11bGF0ZUxvc2UoKSB7XG4gICAgLy8g0J7Rh9C40YnQsNGU0LzQviDQtNC+0YjQutGDXG4gICAgYm9hcmQgPSBbJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJ107XG5cbiAgICAvLyDQktGB0YLQsNC90L7QstC70Y7RlNC80L4g0LLQuNCz0YDQsNGI0L3RgyDQutC+0LzQsdGW0L3QsNGG0ZbRjiDQtNC70Y8g0LrQvtC80L8n0Y7RgtC10YDQsFxuICAgIGJvYXJkWzNdID0gJ9CT0YDQsNCy0LXRhtGMIDAyJztcbiAgICBib2FyZFs0XSA9ICfQk9GA0LDQstC10YbRjCAwMic7XG4gICAgYm9hcmRbNV0gPSAn0JPRgNCw0LLQtdGG0YwgMDInO1xuXG4gICAgLy8g0J7QvdC+0LLQu9GO0ZTQvNC+IFVJXG4gICAgY2VsbHMuZm9yRWFjaCgoY2VsbCwgaW5kZXgpID0+IHtcbiAgICAgICAgLy8gY2VsbC50ZXh0Q29udGVudCA9ICcnO1xuICAgICAgICBjZWxsLmNsYXNzTGlzdC5yZW1vdmUoJ3Rha2VuJywgJ1gtcGxheWVyJywgJ08tcGxheWVyJyk7XG5cbiAgICAgICAgaWYgKGJvYXJkW2luZGV4XSA9PT0gJ9CT0YDQsNCy0LXRhtGMIDAyJykge1xuICAgICAgICAgICAgLy8gY2VsbC50ZXh0Q29udGVudCA9ICdPJztcbiAgICAgICAgICAgIGNlbGwuY2xhc3NMaXN0LmFkZCgnTy1wbGF5ZXInLCAndGFrZW4nKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8g0J/QvtC60LDQt9GD0ZTQvNC+INC70ZbQvdGW0Y4g0L/QtdGA0LXQvNC+0LPQuFxuICAgIHNob3dXaW5MaW5lKFszLCA0LCA1XSk7XG5cbiAgICAvLyDQl9Cw0L/Rg9GB0LrQsNGU0LzQviDQsNC90ZbQvNCw0YbRltGOINC30LDQstC10YDRiNC10L3QvdGPINCz0YDQuFxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBzdGF0dXNUZXh0LnRleHRDb250ZW50ID0gJ9CT0YDQsNCy0LXRhtGMIDAyJztcbiAgICAgICAgaGlkZUFmdGVyR2FtZShcImxvc2VcIik7XG4gICAgICAgIGVuZEdhbWUoKTtcbiAgICB9LCAxMDAwKTtcbn1cblxuLy8g0KTRg9C90LrRhtGW0Y8g0LTQu9GPINGB0LjQvNGD0LvRj9GG0ZbRlyDQvdGW0YfQuNGXXG5mdW5jdGlvbiBzaW11bGF0ZURyYXcoKSB7XG4gICAgLy8g0J7Rh9C40YnQsNGU0LzQviDQtNC+0YjQutGDXG4gICAgYm9hcmQgPSBbJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJ107XG5cbiAgICAvLyDQktGB0YLQsNC90L7QstC70Y7RlNC80L4g0L3RltGH0LjQudC90YMg0LTQvtGI0LrRg1xuICAgIGJvYXJkWzBdID0gJ9CT0YDQsNCy0LXRhtGMIDAxJztcbiAgICBib2FyZFsxXSA9ICfQk9GA0LDQstC10YbRjCAwMic7XG4gICAgYm9hcmRbMl0gPSAn0JPRgNCw0LLQtdGG0YwgMDEnO1xuICAgIGJvYXJkWzNdID0gJ9CT0YDQsNCy0LXRhtGMIDAxJztcbiAgICBib2FyZFs0XSA9ICfQk9GA0LDQstC10YbRjCAwMic7XG4gICAgYm9hcmRbNV0gPSAn0JPRgNCw0LLQtdGG0YwgMDEnO1xuICAgIGJvYXJkWzZdID0gJ9CT0YDQsNCy0LXRhtGMIDAyJztcbiAgICBib2FyZFs3XSA9ICfQk9GA0LDQstC10YbRjCAwMSc7XG4gICAgYm9hcmRbOF0gPSAn0JPRgNCw0LLQtdGG0YwgMDInO1xuXG4gICAgLy8g0J7QvdC+0LLQu9GO0ZTQvNC+IFVJXG4gICAgY2VsbHMuZm9yRWFjaCgoY2VsbCwgaW5kZXgpID0+IHtcbiAgICAgICAgLy8gY2VsbC50ZXh0Q29udGVudCA9ICcnO1xuICAgICAgICBjZWxsLmNsYXNzTGlzdC5yZW1vdmUoJ3Rha2VuJywgJ1gtcGxheWVyJywgJ08tcGxheWVyJyk7XG5cbiAgICAgICAgaWYgKGJvYXJkW2luZGV4XSA9PT0gJ9CT0YDQsNCy0LXRhtGMIDAxJykge1xuICAgICAgICAgICAgLy8gY2VsbC50ZXh0Q29udGVudCA9ICdYJztcbiAgICAgICAgICAgIGNlbGwuY2xhc3NMaXN0LmFkZCgnWC1wbGF5ZXInLCAndGFrZW4nKTtcbiAgICAgICAgfSBlbHNlIGlmIChib2FyZFtpbmRleF0gPT09ICfQk9GA0LDQstC10YbRjCAwMicpIHtcbiAgICAgICAgICAgIC8vIGNlbGwudGV4dENvbnRlbnQgPSAnTyc7XG4gICAgICAgICAgICBjZWxsLmNsYXNzTGlzdC5hZGQoJ08tcGxheWVyJywgJ3Rha2VuJyk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vINCX0LDQv9GD0YHQutCw0ZTQvNC+INCw0L3RltC80LDRhtGW0Y4g0LfQsNCy0LXRgNGI0LXQvdC90Y8g0LPRgNC4XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHN0YXR1c1RleHQudGV4dENvbnRlbnQgPSBcItCd0ZbRh9C40Y8hXCI7XG4gICAgICAgIGhpZGVBZnRlckdhbWUoXCJkcmF3XCIpO1xuICAgIH0sIDEwMDApO1xufVxuXG4vLyDQntCx0YDQvtCx0L3QuNC6INC60LvRltC60ZbQsiDQtNC70Y8g0YLQtdGB0YLQvtCy0LjRhSDRgdGG0LXQvdCw0YDRltGX0LJcbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50ZXN0LXNjZW5hcmlvJykuZm9yRWFjaChidG4gPT4ge1xuICAgIGJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICAgIGNvbnN0IHNjZW5hcmlvID0gZS50YXJnZXQuZGF0YXNldC5zY2VuYXJpbztcblxuICAgICAgICBzd2l0Y2goc2NlbmFyaW8pIHtcbiAgICAgICAgICAgIGNhc2UgJ3dpbic6XG4gICAgICAgICAgICAgICAgc2ltdWxhdGVXaW4oKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2xvc2UnOlxuICAgICAgICAgICAgICAgIHNpbXVsYXRlTG9zZSgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnZHJhdyc6XG4gICAgICAgICAgICAgICAgc2ltdWxhdGVEcmF3KCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdyZXNldCc6XG4gICAgICAgICAgICAgICAgaW5pdGlhbGl6ZUdhbWUoKTtcbiAgICAgICAgICAgICAgICBnYW1lT3ZlclRleHQudGV4dENvbnRlbnQgPSBgYDtcbiAgICAgICAgICAgICAgICBnYW1lR3JpZC5zdHlsZS5vcGFjaXR5ID0gXCIxXCI7XG4gICAgICAgICAgICAgICAgZ2FtZUNvbnRhaW5lci5zdHlsZS5vcGFjaXR5ID0gXCIxXCI7XG4gICAgICAgICAgICAgICAgcGVyc0xlZnQuc3R5bGUudHJhbnNmb3JtID0gXCJ0cmFuc2xhdGVYKDAlKVwiO1xuICAgICAgICAgICAgICAgIHBlcnNSaWdodC5zdHlsZS50cmFuc2Zvcm0gPSBcInRyYW5zbGF0ZVgoMCUpIHNjYWxlKC0xLCAxKVwiO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8g0KXQvtCy0LDRlNC80L4g0LLQuNC/0LDQtNCw0Y7Rh9C1INC80LXQvdGOINC/0ZbRgdC70Y8g0LLQuNCx0L7RgNGDXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50ZXN0LWRyb3Bkb3duLWNvbnRlbnQnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIH0pO1xufSk7XG5cbi8vINCl0L7QstCw0ZTQvNC+INCy0LjQv9Cw0LTQsNGO0YfQtSDQvNC10L3RjiDQv9GA0Lgg0LrQu9GW0LrRgyDQv9C+0LfQsCDQvdC40LxcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcblxuICAgIGNvbnNvbGUubG9nKGUudGFyZ2V0KTtcbiAgICBpZiAoIWUudGFyZ2V0LmNsb3Nlc3QoJy50ZXN0LWRyb3Bkb3duJykpIHtcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRlc3QtZHJvcGRvd24tY29udGVudCcpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgfWVsc2V7XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50ZXN0LWRyb3Bkb3duLWNvbnRlbnQnKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICB9XG59KTsiXX0=
