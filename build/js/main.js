"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
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
  checkStatusContainer(currentPlayer);
  checkStatusIcon(currentPlayer);
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
      setTimeout(function () {
        statusText.textContent = "".concat(computerPlayer);
      }, 1500);
      currentPlayer = computerPlayer;
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

//// test
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
style.textContent = "\n  .test-dropdown {\n    z-index: 9999;\n  }\n\n  .test-dropdown-btn {\n    background-color: #4CAF50;\n    color: white;\n    padding: 10px;\n    font-size: 16px;\n    border: none;\n    cursor: pointer;\n    border-radius: 4px;\n  }\n\n  .test-dropdown-content {\n    display: none;\n    position: absolute;\n    background-color: #f9f9f9;\n    min-width: 160px;\n    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);\n    z-index: 1;\n    border-radius: 4px;\n    overflow: hidden;\n  }\n\n  .test-dropdown-content button {\n    color: black;\n    padding: 12px 16px;\n    text-decoration: none;\n    display: block;\n    width: 100%;\n    text-align: left;\n    border: none;\n    background: none;\n    cursor: pointer;\n  }\n\n  .test-dropdown-content button:hover {\n    background-color: #f1f1f1;\n  }\n\n  .test-dropdown:hover .test-dropdown-content {\n    display: block;\n  }\n";
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
document.querySelector(".test-btn").addEventListener('click', function (e) {
  document.querySelector('.test-menu').classList.toggle('hide');
});

///// test
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsidXJsIiwiVVJMIiwid2luZG93IiwibG9jYXRpb24iLCJocmVmIiwicGFyYW1zIiwibGlua1BhcmFtcyIsInNlYXJjaFBhcmFtcyIsImhhcyIsInJlZGlyZWN0VXJsIiwiZ2V0IiwibWF0Y2giLCJsZW5ndGgiLCJsb2NhbFN0b3JhZ2UiLCJzZXRJdGVtIiwiZm9yRWFjaCIsInBhcmFtIiwibGlua1BhcmFtIiwiYWRkRXZlbnRMaXN0ZW5lciIsImUiLCJsaW5rIiwicGFyZW50IiwidGFyZ2V0IiwiY2xvc2VzdCIsImdldEF0dHJpYnV0ZSIsInByZXZlbnREZWZhdWx0IiwiYWZmaWQiLCJnZXRJdGVtIiwiY3BhaWQiLCJwYXRobmFtZSIsInNldCIsImRvY3VtZW50IiwiY2VsbHMiLCJxdWVyeVNlbGVjdG9yQWxsIiwic3RhdHVzVGV4dCIsImdldEVsZW1lbnRCeUlkIiwic3RhdHVzVGV4dEluZm8iLCJzdGF0dXNDb250YWluZXIiLCJxdWVyeVNlbGVjdG9yIiwic3RhdHVzQm94IiwicmVzdGFydEJ0bnMiLCJvdmVybGF5Iiwic2lkZUJ0bnMiLCJzdGFydEdhbWUiLCJnYW1lQ29udGFpbmVyIiwibGFuZFdyYXBwZXIiLCJzdGF0dXNJY29uWCIsInN0YXR1c0ljb25PIiwiZ2FtZUdyaWQiLCJwZXJzTGVmdCIsInBlcnNSaWdodCIsImdhbWVPdmVyVGV4dCIsImJvYXJkIiwiaXNDb21wdXRlclgiLCJjdXJyZW50UGxheWVyIiwiY29tcHV0ZXJQbGF5ZXIiLCJib2R5Iiwic3R5bGUiLCJvdmVyZmxvdyIsImNsYXNzTGlzdCIsInJlbW92ZSIsImFkZCIsIndpbm5pbmdDb21ib3MiLCJpbml0aWFsaXplR2FtZSIsImNlbGwiLCJ0ZXh0Q29udGVudCIsImxpbmUiLCJ0cmFuc2Zvcm0iLCJjaGVja1N0YXR1c0NvbnRhaW5lciIsImNoZWNrU3RhdHVzSWNvbiIsInNldFRpbWVvdXQiLCJiZXN0TW92ZSIsInBsYXllciIsImNoZWNrV2lubmVyIiwiY29tYm8iLCJldmVyeSIsImluZGV4IiwiaXNEcmF3IiwiYmVzdFNjb3JlIiwiSW5maW5pdHkiLCJtb3ZlIiwiaSIsInNjb3JlIiwibWluaW1heCIsIndpbm5pbmdDb21ibyIsInNob3dXaW5MaW5lIiwiaGlkZUFmdGVyR2FtZSIsImVuZEdhbWUiLCJkZXB0aCIsImlzTWF4aW1pemluZyIsIk1hdGgiLCJtYXgiLCJtaW4iLCJoYW5kbGVDZWxsQ2xpY2siLCJkYXRhc2V0Iiwid2lubmVyIiwib3BhY2l0eSIsInNob3dQb3B1cCIsImJ0biIsImNvbnNvbGUiLCJsb2ciLCJzaWRlIiwiaXRlbSIsInBvcHVwIiwiY29udGFpbnMiLCJlbmFibGVNb3VzZVNjYWxlIiwiaGlkZVBvcHVwIiwiZWxlbWVudCIsIm1pblNjYWxlIiwibWF4U2NhbGUiLCJ0cmFuc2l0aW9uIiwicmVjdCIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsIngiLCJjbGllbnRYIiwibGVmdCIsInkiLCJjbGllbnRZIiwidG9wIiwiY2VudGVyWCIsIndpZHRoIiwiY2VudGVyWSIsImhlaWdodCIsImRpc3RhbmNlIiwiaHlwb3QiLCJtYXhEaXN0YW5jZSIsInNjYWxlIiwicG9zaXRpb25zIiwicm90YXRlIiwia2V5Iiwic29ydCIsImEiLCJiIiwiam9pbiIsInBvcyIsInRlc3RQb3B1cEJ1dHRvbnMiLCJidXR0b24iLCJwb3B1cENsYXNzIiwiYWxsUG9wdXBzIiwiaXNBbHJlYWR5T3BlbiIsInAiLCJ0ZXN0TWVudSIsImNyZWF0ZUVsZW1lbnQiLCJjbGFzc05hbWUiLCJpbm5lckhUTUwiLCJoZWFkIiwiYXBwZW5kQ2hpbGQiLCJzaW11bGF0ZVdpbiIsInNpbXVsYXRlTG9zZSIsInNpbXVsYXRlRHJhdyIsInNjZW5hcmlvIiwiZGlzcGxheSIsInRvZ2dsZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQTtBQUNBLENBQUMsWUFBWTtFQUNULElBQUlBLEdBQUcsR0FBRyxJQUFJQyxHQUFHLENBQUNDLE1BQU0sQ0FBQ0MsUUFBUSxDQUFDQyxJ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QXhILFFBQVEsQ0FBQ2IsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFVBQUNDLENBQUMsRUFBSztFQUV0Q2dGLE9BQU8sQ0FBQ0MsR0FBRyxDQUFDakYsQ0FBQyxDQUFDRyxNQUFNLENBQUM7RUFDckIsSUFBSSxDQUFDSCxDQUFDLENBQUNHLE1BQU0sQ0FBQ0MsT0FBTyxDQUFDLGdCQUFnQixDQUFDLEVBQUU7SUFDckNRLFFBQVEsQ0FBQ08sYUFBYSxDQUFDLHdCQUF3QixDQUFDLENBQUNtQixLQUFLLENBQUM4RixPQUFPLEdBQUcsTUFBTTtFQUMzRSxDQUFDLE1BQUk7SUFDRHhILFFBQVEsQ0FBQ08sYUFBYSxDQUFDLHdCQUF3QixDQUFDLENBQUNtQixLQUFLLENBQUM4RixPQUFPLEdBQUcsT0FBTztFQUM1RTtBQUNKLENBQUMsQ0FBQztBQUVGeEgsUUFBUSxDQUFDTyxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUNwQixnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsVUFBQ0MsQ0FBQyxFQUFLO0VBQ2pFWSxRQUFRLENBQUNPLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQ3FCLFNBQVMsQ0FBQzZGLE1BQU0sQ0FBQyxNQUFNLENBQUM7QUFDakUsQ0FBQyxDQUFDOztBQUVGIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvL1REU1xuKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdXJsID0gbmV3IFVSTCh3aW5kb3cubG9jYXRpb24uaHJlZik7XG4gICAgdmFyIHBhcmFtcyA9IFsnbCcsICd1dG1fc291cmNlJywgJ3V0bV9tZWRpdW0nLCAndXRtX2NhbXBhaWduJywgJ3V0bV90ZXJtJywgJ3V0bV9jb250ZW50JywgJ3BhcmFtMScsICdwYXJhbTInLCAncGFyYW0zJywgJ3BhcmFtNCcsICdjcmVhdGl2ZV90eXBlJywgJ2NyZWF0aXZlX2lkJ107XG4gICAgdmFyIGxpbmtQYXJhbXMgPSBbJ2FmZmlkJywgJ2NwYWlkJ107IC8vINC40YnQtdC8INCyIHVybCByZWRpcmVjdFVybCDQsiB1cmw6XG5cbiAgICBpZiAodXJsLnNlYXJjaFBhcmFtcy5oYXMoJ3JlZGlyZWN0VXJsJykpIHtcbiAgICAgICAgdmFyIHJlZGlyZWN0VXJsID0gbmV3IFVSTCh1cmwuc2VhcmNoUGFyYW1zLmdldCgncmVkaXJlY3RVcmwnKSk7XG5cbiAgICAgICAgaWYgKHJlZGlyZWN0VXJsLmhyZWYubWF0Y2goL1xcLy9nKS5sZW5ndGggPT09IDQgJiYgcmVkaXJlY3RVcmwuc2VhcmNoUGFyYW1zLmdldCgnbCcpKSB7XG4gICAgICAgICAgICAvL9C10YHQu9C4INGB0YHRi9C70LrQsCDQsiDRgdGB0YvQu9C60LAgcmVkaXJlY3RVcmwg0LrQvtGA0YDQtdC60YLQvdCw0Y9cbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdyZWRpcmVjdFVybCcsIHJlZGlyZWN0VXJsLmhyZWYpOyAvLyDRg9C60LDQt9GL0LLQsNC10Lwg0YLQvtGH0LrQvtC5INCy0YXQvtC00LAg0LTQvtC80LXQvSDRgSDQv9GA0L7RgtC+0LrQvtC70L7QvCDQuNC3IHJlZGlyZWN0VXJsXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwYXJhbXMuZm9yRWFjaChmdW5jdGlvbiAocGFyYW0pIHtcbiAgICAgICAgaWYgKHVybC5zZWFyY2hQYXJhbXMuaGFzKHBhcmFtKSkgbG9jYWxTdG9yYWdlLnNldEl0ZW0ocGFyYW0sIHVybC5zZWFyY2hQYXJhbXMuZ2V0KHBhcmFtKSk7XG4gICAgfSk7XG5cbiAgICBsaW5rUGFyYW1zLmZvckVhY2goZnVuY3Rpb24gKGxpbmtQYXJhbSkge1xuICAgICAgICBpZiAodXJsLnNlYXJjaFBhcmFtcy5oYXMobGlua1BhcmFtKSkgbG9jYWxTdG9yYWdlLnNldEl0ZW0obGlua1BhcmFtLCB1cmwuc2VhcmNoUGFyYW1zLmdldChsaW5rUGFyYW0pKTtcbiAgICB9KTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHZhciBsaW5rLFxuICAgICAgICAgICAgcGFyZW50ID0gZS50YXJnZXQuY2xvc2VzdCgnYScpO1xuXG4gICAgICAgIGlmIChwYXJlbnQuZ2V0QXR0cmlidXRlKCdocmVmJykgIT09ICdodHRwczovL3Rkcy5mYXZiZXQucGFydG5lcnMnKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocGFyZW50KSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB2YXIgYWZmaWQgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnYWZmaWQnKTtcbiAgICAgICAgICAgIHZhciBjcGFpZCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdjcGFpZCcpO1xuXG4gICAgICAgICAgICBpZiAobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJyZWRpcmVjdFVybFwiKSkge1xuICAgICAgICAgICAgICAgIGxpbmsgPSBuZXcgVVJMKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwicmVkaXJlY3RVcmxcIikpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsaW5rID0gbmV3IFVSTChwYXJlbnQuaHJlZik7XG4gICAgICAgICAgICAgICAgaWYgKGFmZmlkICYmIGNwYWlkKSB7XG4gICAgICAgICAgICAgICAgICAgIGxpbmsucGF0aG5hbWUgPSAnLycgKyBhZmZpZCArICcvJyArIGNwYWlkO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcGFyYW1zLmZvckVhY2goZnVuY3Rpb24gKHBhcmFtKSB7XG4gICAgICAgICAgICAgICAgaWYgKHVybC5zZWFyY2hQYXJhbXMuaGFzKHBhcmFtKSkge1xuICAgICAgICAgICAgICAgICAgICBsaW5rLnNlYXJjaFBhcmFtcy5zZXQocGFyYW0sIGxvY2FsU3RvcmFnZS5nZXRJdGVtKHBhcmFtKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGRvY3VtZW50LmxvY2F0aW9uLmhyZWYgPSBsaW5rO1xuICAgICAgICB9XG4gICAgfSk7XG59KSgpO1xuXG5cbmNvbnN0IGNlbGxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmNlbGwnKTtcbmNvbnN0IHN0YXR1c1RleHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3RhdHVzJyk7XG5jb25zdCBzdGF0dXNUZXh0SW5mbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdGF0dXMtdGV4dCcpO1xuY29uc3Qgc3RhdHVzQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5sYW5kX19sZWZ0XCIpO1xuY29uc3Qgc3RhdHVzQm94ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5sYW5kX19zdGF0dXNcIik7XG5jb25zdCByZXN0YXJ0QnRucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5yZXN0YXJ0LWdhbWUnKTtcbmNvbnN0IG92ZXJsYXkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm92ZXJsYXlcIik7XG5jb25zdCBzaWRlQnRucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zaWRlLWJ0bicpO1xuY29uc3Qgc3RhcnRHYW1lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnN0YXJ0LWdhbWUnKTtcbmNvbnN0IGdhbWVDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ2FtZScpO1xuY29uc3QgbGFuZFdyYXBwZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubGFuZCcpO1xuY29uc3Qgc3RhdHVzSWNvblggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1wbGF5ZXI9XCJYXCJdJyk7XG5jb25zdCBzdGF0dXNJY29uTyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXBsYXllcj1cIk9cIl0nKTtcbmNvbnN0IGdhbWVHcmlkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmdhbWUtZ3JpZCcpO1xuY29uc3QgcGVyc0xlZnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZ2FtZS1wZXJzLl9sZWZ0Jyk7XG5jb25zdCBwZXJzUmlnaHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZ2FtZS1wZXJzLl9yaWdodCcpO1xuY29uc3QgZ2FtZU92ZXJUZXh0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmdhbWUtb3ZlcicpO1xuXG5sZXQgYm9hcmQgPSBbJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJ107XG5sZXQgaXNDb21wdXRlclggPSB0cnVlO1xubGV0IGN1cnJlbnRQbGF5ZXIsIGNvbXB1dGVyUGxheWVyO1xuXG5kb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gXCJoaWRkZW5cIjtcblxuaWYgKGlzQ29tcHV0ZXJYKSB7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtc2lkZT1cIlhcIl0nKS5jbGFzc0xpc3QucmVtb3ZlKCdfYWN0aXZlJyk7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtc2lkZT1cIjBcIl0nKS5jbGFzc0xpc3QuYWRkKCdfYWN0aXZlJyk7XG59IGVsc2Uge1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXNpZGU9XCIwXCJdJykuY2xhc3NMaXN0LnJlbW92ZSgnX2FjdGl2ZScpO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXNpZGU9XCJYXCJdJykuY2xhc3NMaXN0LmFkZCgnX2FjdGl2ZScpO1xufVxuXG5jb25zdCB3aW5uaW5nQ29tYm9zID0gW1xuICAgIFswLCAxLCAyXSxcbiAgICBbMywgNCwgNV0sXG4gICAgWzYsIDcsIDhdLFxuICAgIFswLCAzLCA2XSxcbiAgICBbMSwgNCwgN10sXG4gICAgWzIsIDUsIDhdLFxuICAgIFswLCA0LCA4XSxcbiAgICBbMiwgNCwgNl0sXG5dO1xuXG5mdW5jdGlvbiBpbml0aWFsaXplR2FtZSgpIHtcbiAgICBjdXJyZW50UGxheWVyID0gaXNDb21wdXRlclggPyAn0JPRgNCw0LLQtdGG0YwgMDInIDogJ9CT0YDQsNCy0LXRhtGMIDAxJztcbiAgICBjb21wdXRlclBsYXllciA9IGlzQ29tcHV0ZXJYID8gJ9CT0YDQsNCy0LXRhtGMIDAxJyA6ICfQk9GA0LDQstC10YbRjCAwMic7XG4gICAgYm9hcmQgPSBbJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJ107XG4gICAgY2VsbHMuZm9yRWFjaChjZWxsID0+IHtcbiAgICAgICAgY2VsbC50ZXh0Q29udGVudCA9ICcnO1xuICAgICAgICBjZWxsLmNsYXNzTGlzdC5yZW1vdmUoJ3Rha2VuJywgJ1gtcGxheWVyJywgJ08tcGxheWVyJyk7XG4gICAgfSk7XG5cbiAgICBjb25zdCBsaW5lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLndpbi1saW5lJyk7XG4gICAgaWYgKGxpbmUpIHtcbiAgICAgICAgbGluZS5zdHlsZS50cmFuc2Zvcm0gPSAnc2NhbGVYKDApJztcbiAgICB9XG5cblxuICAgIGNoZWNrU3RhdHVzQ29udGFpbmVyKGN1cnJlbnRQbGF5ZXIpO1xuICAgIGNoZWNrU3RhdHVzSWNvbihjdXJyZW50UGxheWVyKTtcblxuICAgIHN0YXR1c1RleHQudGV4dENvbnRlbnQgPSBgJHtjdXJyZW50UGxheWVyfWA7XG4gICAgc3RhdHVzVGV4dEluZm8udGV4dENvbnRlbnQgPSBg0KLQktCG0Jlf0KXQhtCUYDtcbiAgICBpZiAoY3VycmVudFBsYXllciA9PT0gY29tcHV0ZXJQbGF5ZXIpIHtcbiAgICAgICAgc2V0VGltZW91dChiZXN0TW92ZSwgNTAwKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGNoZWNrU3RhdHVzSWNvbihwbGF5ZXIpIHtcbiAgICBpZiAocGxheWVyID09PSAn0JPRgNCw0LLQtdGG0YwgMDEnKSB7XG4gICAgICAgIHN0YXR1c0ljb25YLmNsYXNzTGlzdC5hZGQoXCJfYWN0aXZlXCIpO1xuICAgICAgICBzdGF0dXNJY29uTy5jbGFzc0xpc3QucmVtb3ZlKFwiX2FjdGl2ZVwiKTtcbiAgICB9XG4gICAgaWYgKHBsYXllciA9PT0gJ9CT0YDQsNCy0LXRhtGMIDAyJykge1xuICAgICAgICBzdGF0dXNJY29uTy5jbGFzc0xpc3QuYWRkKFwiX2FjdGl2ZVwiKTtcbiAgICAgICAgc3RhdHVzSWNvblguY2xhc3NMaXN0LnJlbW92ZShcIl9hY3RpdmVcIik7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBjaGVja1N0YXR1c0NvbnRhaW5lcihwbGF5ZXIpIHtcbiAgICBpZiAocGxheWVyID09PSAn0JPRgNCw0LLQtdGG0YwgMDEnKSB7XG4gICAgICAgIHN0YXR1c0JveC5jbGFzc0xpc3QuYWRkKFwiWC1wbGF5ZXJcIik7XG4gICAgICAgIHN0YXR1c0JveC5jbGFzc0xpc3QucmVtb3ZlKFwiTy1wbGF5ZXJcIik7XG4gICAgfVxuICAgIGlmIChwbGF5ZXIgPT09ICfQk9GA0LDQstC10YbRjCAwMicpIHtcbiAgICAgICAgc3RhdHVzQm94LmNsYXNzTGlzdC5hZGQoXCJPLXBsYXllclwiKTtcbiAgICAgICAgc3RhdHVzQm94LmNsYXNzTGlzdC5yZW1vdmUoXCJYLXBsYXllclwiKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGNoZWNrV2lubmVyKHBsYXllcikge1xuICAgIGZvciAoY29uc3QgY29tYm8gb2Ygd2lubmluZ0NvbWJvcykge1xuICAgICAgICBpZiAoY29tYm8uZXZlcnkoaW5kZXggPT4gYm9hcmRbaW5kZXhdID09PSBwbGF5ZXIpKSB7XG4gICAgICAgICAgICByZXR1cm4gY29tYm87XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG59XG5cbmZ1bmN0aW9uIGlzRHJhdygpIHtcbiAgICByZXR1cm4gYm9hcmQuZXZlcnkoY2VsbCA9PiBjZWxsICE9PSAnJyk7XG59XG5cbmZ1bmN0aW9uIGJlc3RNb3ZlKCkge1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBsZXQgYmVzdFNjb3JlID0gLUluZmluaXR5O1xuICAgICAgICBsZXQgbW92ZTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJvYXJkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoYm9hcmRbaV0gPT09ICcnKSB7XG4gICAgICAgICAgICAgICAgYm9hcmRbaV0gPSBjb21wdXRlclBsYXllcjtcbiAgICAgICAgICAgICAgICBsZXQgc2NvcmUgPSBtaW5pbWF4KGJvYXJkLCAwLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgYm9hcmRbaV0gPSAnJztcbiAgICAgICAgICAgICAgICBpZiAoc2NvcmUgPiBiZXN0U2NvcmUpIHtcbiAgICAgICAgICAgICAgICAgICAgYmVzdFNjb3JlID0gc2NvcmU7XG4gICAgICAgICAgICAgICAgICAgIG1vdmUgPSBpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGJvYXJkW21vdmVdID0gY29tcHV0ZXJQbGF5ZXI7XG5cbiAgICAgICAgaWYgKGNvbXB1dGVyUGxheWVyID09PSBcItCT0YDQsNCy0LXRhtGMIDAyXCIpIHtcbiAgICAgICAgICAgIGNlbGxzW21vdmVdLmNsYXNzTGlzdC5hZGQoJ08tcGxheWVyJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbXB1dGVyUGxheWVyID09PSBcItCT0YDQsNCy0LXRhtGMIDAxXCIpIHtcbiAgICAgICAgICAgIGNlbGxzW21vdmVdLmNsYXNzTGlzdC5hZGQoJ1gtcGxheWVyJyk7XG4gICAgICAgIH1cblxuICAgICAgICBjaGVja1N0YXR1c0ljb24oY29tcHV0ZXJQbGF5ZXIpO1xuICAgICAgICBjaGVja1N0YXR1c0NvbnRhaW5lcihjdXJyZW50UGxheWVyKTtcbiAgICAgICAgc3RhdHVzVGV4dEluZm8udGV4dENvbnRlbnQgPSBg0KfQldCa0JDQmWA7XG5cbiAgICAgICAgY2VsbHNbbW92ZV0uY2xhc3NMaXN0LmFkZCgndGFrZW4nKTtcblxuICAgICAgICBjb25zdCB3aW5uaW5nQ29tYm8gPSBjaGVja1dpbm5lcihjb21wdXRlclBsYXllcik7XG4gICAgICAgIGlmICh3aW5uaW5nQ29tYm8pIHtcbiAgICAgICAgICAgIHNob3dXaW5MaW5lKHdpbm5pbmdDb21ibyk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+e1xuICAgICAgICAgICAgICAgIHN0YXR1c1RleHQudGV4dENvbnRlbnQgPSBgJHtjb21wdXRlclBsYXllcn1gO1xuICAgICAgICAgICAgICAgIGhpZGVBZnRlckdhbWUoXCJsb3NlXCIpXG4gICAgICAgICAgICAgICAgZW5kR2FtZSgpO1xuICAgICAgICAgICAgfSwgMTAwMClcbiAgICAgICAgfSBlbHNlIGlmIChpc0RyYXcoKSkge1xuICAgICAgICAgICAgaGlkZUFmdGVyR2FtZShcImRyYXdcIilcbiAgICAgICAgICAgIHN0YXR1c1RleHQudGV4dENvbnRlbnQgPSBcItCd0ZbRh9C40Y8hXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UGxheWVyID0gY3VycmVudFBsYXllciA9PT0gJ9CT0YDQsNCy0LXRhtGMIDAxJyA/ICfQk9GA0LDQstC10YbRjCAwMicgOiAn0JPRgNCw0LLQtdGG0YwgMDEnO1xuICAgICAgICAgICAgICAgIGNoZWNrU3RhdHVzSWNvbihjdXJyZW50UGxheWVyKTtcbiAgICAgICAgICAgICAgICBjaGVja1N0YXR1c0NvbnRhaW5lcihjdXJyZW50UGxheWVyKTtcbiAgICAgICAgICAgICAgICBzdGF0dXNUZXh0SW5mby50ZXh0Q29udGVudCA9IGDQotCS0IbQmV/QpdCG0JRgO1xuICAgICAgICAgICAgICAgIHN0YXR1c1RleHQudGV4dENvbnRlbnQgPSBgJHtjdXJyZW50UGxheWVyfWA7XG4gICAgICAgICAgICB9LCAxNTAwKTtcbiAgICAgICAgfVxuICAgIH0sIDEwMDApO1xufVxuXG5mdW5jdGlvbiBtaW5pbWF4KGJvYXJkLCBkZXB0aCwgaXNNYXhpbWl6aW5nKSB7XG4gICAgaWYgKGNoZWNrV2lubmVyKGNvbXB1dGVyUGxheWVyKSkgcmV0dXJuIDEwIC0gZGVwdGg7XG4gICAgaWYgKGNoZWNrV2lubmVyKGN1cnJlbnRQbGF5ZXIpKSByZXR1cm4gZGVwdGggLSAxMDtcbiAgICBpZiAoaXNEcmF3KCkpIHJldHVybiAwO1xuXG4gICAgaWYgKGlzTWF4aW1pemluZykge1xuICAgICAgICBsZXQgYmVzdFNjb3JlID0gLUluZmluaXR5O1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJvYXJkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoYm9hcmRbaV0gPT09ICcnKSB7XG4gICAgICAgICAgICAgICAgYm9hcmRbaV0gPSBjb21wdXRlclBsYXllcjtcbiAgICAgICAgICAgICAgICBsZXQgc2NvcmUgPSBtaW5pbWF4KGJvYXJkLCBkZXB0aCArIDEsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICBib2FyZFtpXSA9ICcnO1xuICAgICAgICAgICAgICAgIGJlc3RTY29yZSA9IE1hdGgubWF4KHNjb3JlLCBiZXN0U2NvcmUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBiZXN0U2NvcmU7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IGJlc3RTY29yZSA9IEluZmluaXR5O1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJvYXJkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoYm9hcmRbaV0gPT09ICcnKSB7XG4gICAgICAgICAgICAgICAgYm9hcmRbaV0gPSBjdXJyZW50UGxheWVyO1xuICAgICAgICAgICAgICAgIGxldCBzY29yZSA9IG1pbmltYXgoYm9hcmQsIGRlcHRoICsgMSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgYm9hcmRbaV0gPSAnJztcbiAgICAgICAgICAgICAgICBiZXN0U2NvcmUgPSBNYXRoLm1pbihzY29yZSwgYmVzdFNjb3JlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYmVzdFNjb3JlO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gaGFuZGxlQ2VsbENsaWNrKGUpIHtcbiAgICBjb25zdCBjZWxsID0gZS50YXJnZXQ7XG4gICAgY29uc3QgaW5kZXggPSBjZWxsLmRhdGFzZXQuaW5kZXg7XG5cbiAgICBpZiAoYm9hcmRbaW5kZXhdID09PSAnJyAmJiBjdXJyZW50UGxheWVyICE9PSBjb21wdXRlclBsYXllcikge1xuICAgICAgICBib2FyZFtpbmRleF0gPSBjdXJyZW50UGxheWVyO1xuXG4gICAgICAgIGlmIChjdXJyZW50UGxheWVyID09PSBcItCT0YDQsNCy0LXRhtGMIDAyXCIpIHtcbiAgICAgICAgICAgIGNlbGwuY2xhc3NMaXN0LmFkZCgnTy1wbGF5ZXInKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY3VycmVudFBsYXllciA9PT0gXCLQk9GA0LDQstC10YbRjCAwMVwiKSB7XG4gICAgICAgICAgICBjZWxsLmNsYXNzTGlzdC5hZGQoJ1gtcGxheWVyJyk7XG4gICAgICAgIH1cblxuICAgICAgICBjZWxsLmNsYXNzTGlzdC5hZGQoJ3Rha2VuJyk7XG5cbiAgICAgICAgY29uc3Qgd2lubmluZ0NvbWJvID0gY2hlY2tXaW5uZXIoY3VycmVudFBsYXllcik7XG4gICAgICAgIGlmICh3aW5uaW5nQ29tYm8pIHtcbiAgICAgICAgICAgIHNob3dXaW5MaW5lKHdpbm5pbmdDb21ibyk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICBzdGF0dXNUZXh0LnRleHRDb250ZW50ID0gYCR7Y3VycmVudFBsYXllcn1gO1xuICAgICAgICAgICAgICAgIGhpZGVBZnRlckdhbWUoXCJ3aW5cIilcbiAgICAgICAgICAgICAgICBlbmRHYW1lKCk7XG4gICAgICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgfSBlbHNlIGlmIChpc0RyYXcoKSkge1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgaGlkZUFmdGVyR2FtZShcImRyYXdcIilcbiAgICAgICAgICAgICAgICBzdGF0dXNUZXh0LnRleHRDb250ZW50ID0gXCLQndGW0YfQuNGPIVwiO1xuICAgICAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+e1xuICAgICAgICAgICAgICAgIHN0YXR1c1RleHQudGV4dENvbnRlbnQgPSBgJHtjb21wdXRlclBsYXllcn1gO1xuICAgICAgICAgICAgfSwxNTAwKVxuICAgICAgICAgICAgY3VycmVudFBsYXllciA9IGNvbXB1dGVyUGxheWVyO1xuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGJlc3RNb3ZlLCA1MDApO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBoaWRlQWZ0ZXJHYW1lKHdpbm5lcil7XG4gICAgZ2FtZUNvbnRhaW5lci5zdHlsZS5vcGFjaXR5ID0gXCIwXCI7XG4gICAgZ2FtZUdyaWQuc3R5bGUub3BhY2l0eSA9IFwiMFwiO1xuICAgIHN0YXR1c0JveC5jbGFzc0xpc3QucmVtb3ZlKFwiTy1wbGF5ZXJcIiwgXCJYLXBsYXllclwiKTtcbiAgICBwZXJzTGVmdC5zdHlsZS50cmFuc2Zvcm0gPSBcInRyYW5zbGF0ZVgoMjIwJSlcIjtcbiAgICBwZXJzUmlnaHQuc3R5bGUudHJhbnNmb3JtID0gXCJ0cmFuc2xhdGVYKC0yMjAlKSBzY2FsZSgtMSwgMSlcIjtcblxuXG5cbiAgICBpZih3aW5uZXIgPT09IFwibG9zZVwiKXtcbiAgICAgICAgZ2FtZU92ZXJUZXh0LnRleHRDb250ZW50ID0gXCLQvdC1INC/0L7RidCw0YHRgtC40LvQviFcIlxuICAgIH1cbiAgICBpZih3aW5uZXIgPT09IFwid2luXCIpe1xuICAgICAgICBnYW1lT3ZlclRleHQudGV4dENvbnRlbnQgPSBcItGC0Lgg0L/QtdGA0LXQvNGW0LMhXCJcbiAgICB9XG4gICAgaWYod2lubmVyID09PSBcImRyYXdcIil7XG4gICAgICAgIGdhbWVPdmVyVGV4dC50ZXh0Q29udGVudCA9IFwi0YLQuCDQsdGD0LIg0L3QsCDRgNGW0LLQvdGWIVwiXG4gICAgfVxuXG4gICAgc2V0VGltZW91dCgoKSA9PntcbiAgICAgICAgZ2FtZU92ZXJUZXh0LmNsYXNzTGlzdC5yZW1vdmUoXCJvcGFjaXR5XCIpXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT57XG4gICAgICAgICAgICBpZih3aW5uZXIgPT09IFwiZHJhd1wiKXtcbiAgICAgICAgICAgICAgICBzaG93UG9wdXAoXCIuX2RyYXdcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZih3aW5uZXIgPT09IFwid2luXCIpe1xuICAgICAgICAgICAgICAgIHNob3dQb3B1cChcIi5fd2luXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYod2lubmVyID09PSBcImxvc2VcIil7XG4gICAgICAgICAgICAgICAgc2hvd1BvcHVwKFwiLl9sb3NlXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCA1MDApXG5cbiAgICB9LCAxMDAwKVxuXG59XG5cbmZ1bmN0aW9uIGVuZEdhbWUoKSB7XG4gICAgY2VsbHMuZm9yRWFjaChjZWxsID0+IGNlbGwuY2xhc3NMaXN0LmFkZCgndGFrZW4nKSk7XG59XG5cbnJlc3RhcnRCdG5zLmZvckVhY2goYnRuID0+e1xuICAgIGJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgICAgIGlzQ29tcHV0ZXJYID0gIWlzQ29tcHV0ZXJYO1xuICAgICAgICAgICAgaW5pdGlhbGl6ZUdhbWUoKTtcbiAgICAgICAgICAgIGdhbWVPdmVyVGV4dC50ZXh0Q29udGVudCA9IGBgO1xuICAgICAgICAgICAgZ2FtZUdyaWQuc3R5bGUub3BhY2l0eSA9IFwiMVwiO1xuICAgICAgICAgICAgZ2FtZUNvbnRhaW5lci5zdHlsZS5vcGFjaXR5ID0gXCIxXCI7XG4gICAgICAgICAgICBwZXJzTGVmdC5zdHlsZS50cmFuc2Zvcm0gPSBcInRyYW5zbGF0ZVgoMCUpXCI7XG4gICAgICAgICAgICBwZXJzUmlnaHQuc3R5bGUudHJhbnNmb3JtID0gXCJ0cmFuc2xhdGVYKDAlKSBzY2FsZSgtMSwgMSlcIjtcbiAgICAgICAgICAgIHNpZGVCdG5zLmZvckVhY2goYnRuID0+IHtcbiAgICAgICAgICAgICAgICBidG4uY2xhc3NMaXN0LnJlbW92ZShcIl9hY3RpdmVcIilcbiAgICAgICAgICAgICAgICBzdGFydEdhbWUuY2xhc3NMaXN0LmFkZChcImRpc2FibGVkXCIpO1xuICAgICAgICAgICAgICAgIGJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coaXNDb21wdXRlclgpO1xuICAgICAgICAgICAgICAgICAgICBzdGFydEdhbWUuY2xhc3NMaXN0LnJlbW92ZShcImRpc2FibGVkXCIpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBzaWRlID0gYnRuLmRhdGFzZXQuc2lkZTtcbiAgICAgICAgICAgICAgICAgICAgaXNDb21wdXRlclggPSBzaWRlICE9PSAnWCc7XG4gICAgICAgICAgICAgICAgICAgIHNpZGVCdG5zLmZvckVhY2goaXRlbSA9PiBpdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ19hY3RpdmUnKSk7XG4gICAgICAgICAgICAgICAgICAgIGJ0bi5jbGFzc0xpc3QuYWRkKCdfYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9IFwiYXV0b1wiO1xuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5wb3B1cFwiKS5mb3JFYWNoKHBvcHVwID0+IHtcbiAgICAgICAgICAgICAgICBpZihwb3B1cC5jbGFzc0xpc3QuY29udGFpbnMoJ19zdGFydCcpKXtcbiAgICAgICAgICAgICAgICAgICAgcG9wdXAuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZS1wb3B1cCcpO1xuICAgICAgICAgICAgICAgICAgICBwb3B1cC5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlJyk7XG4gICAgICAgICAgICAgICAgICAgIHBvcHVwLnN0eWxlLm9wYWNpdHkgPSBcIjFcIjtcbiAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgcG9wdXAuY2xhc3NMaXN0LmFkZCgnaGlkZS1wb3B1cCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pO1xufSlcblxuY2VsbHMuZm9yRWFjaChjZWxsID0+IGNlbGwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBoYW5kbGVDZWxsQ2xpY2spKTtcblxuc2lkZUJ0bnMuZm9yRWFjaChidG4gPT4ge1xuICAgIGJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgY29uc3Qgc2lkZSA9IGJ0bi5kYXRhc2V0LnNpZGU7XG4gICAgICAgIGlzQ29tcHV0ZXJYID0gc2lkZSAhPT0gJ1gnO1xuICAgICAgICBzaWRlQnRucy5mb3JFYWNoKGl0ZW0gPT4gaXRlbS5jbGFzc0xpc3QucmVtb3ZlKCdfYWN0aXZlJykpO1xuICAgICAgICBidG4uY2xhc3NMaXN0LmFkZCgnX2FjdGl2ZScpO1xuICAgIH0pO1xufSk7XG5cbnN0YXJ0R2FtZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2lkZS1zZWxlY3Rpb24nKS5zdHlsZS5vcGFjaXR5ID0gJzAnO1xuICAgIGdhbWVDb250YWluZXIuc3R5bGUub3BhY2l0eSA9ICcxJztcbiAgICBsYW5kV3JhcHBlci5jbGFzc0xpc3QuYWRkKFwiX2RlY29yXCIpO1xuICAgIGRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSBcImF1dG9cIjtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgZW5hYmxlTW91c2VTY2FsZShkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZGVjb3InKSk7XG4gICAgfSwgMjUwMCk7XG4gICAgaW5pdGlhbGl6ZUdhbWUoKTtcbiAgICBoaWRlUG9wdXAoXCIjc2lkZS1zZWxlY3Rpb25cIik7XG59KTtcblxuZnVuY3Rpb24gc2hvd1BvcHVwKHBvcHVwKSB7XG5cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgcG9wdXAgPSBvdmVybGF5LnF1ZXJ5U2VsZWN0b3IocG9wdXApO1xuICAgICAgICBvdmVybGF5LmNsYXNzTGlzdC5yZW1vdmUoXCJvcGFjaXR5XCIpO1xuICAgICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gXCJoaWRkZW5cIjtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PntcbiAgICAgICAgICAgIHBvcHVwLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRlLXBvcHVwXCIpO1xuICAgICAgICB9LCA1MDApXG4gICAgfSwgMjAwMClcblxufVxuXG5mdW5jdGlvbiBoaWRlUG9wdXAocG9wdXApIHtcbiAgICBwb3B1cCA9IG92ZXJsYXkucXVlcnlTZWxlY3Rvcihwb3B1cCk7XG4gICAgb3ZlcmxheS5jbGFzc0xpc3QuYWRkKFwib3BhY2l0eVwiKTtcbiAgICBwb3B1cC5jbGFzc0xpc3QuYWRkKFwiaGlkZVwiKTtcbn1cblxuZnVuY3Rpb24gZW5hYmxlTW91c2VTY2FsZShlbGVtZW50KSB7XG4gICAgY29uc3QgbWluU2NhbGUgPSAxO1xuICAgIGNvbnN0IG1heFNjYWxlID0gMS4wNTtcbiAgICBlbGVtZW50LnN0eWxlLnRyYW5zaXRpb24gPSAndHJhbnNmb3JtIDAuMXMgZWFzZSc7XG5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCAoZSkgPT4ge1xuICAgICAgICBjb25zdCByZWN0ID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgY29uc3QgeCA9IGUuY2xpZW50WCAtIHJlY3QubGVmdDtcbiAgICAgICAgY29uc3QgeSA9IGUuY2xpZW50WSAtIHJlY3QudG9wO1xuICAgICAgICBjb25zdCBjZW50ZXJYID0gcmVjdC53aWR0aCAvIDI7XG4gICAgICAgIGNvbnN0IGNlbnRlclkgPSByZWN0LmhlaWdodCAvIDI7XG4gICAgICAgIGNvbnN0IGRpc3RhbmNlID0gTWF0aC5oeXBvdCh4IC0gY2VudGVyWCwgeSAtIGNlbnRlclkpO1xuICAgICAgICBjb25zdCBtYXhEaXN0YW5jZSA9IE1hdGguaHlwb3QoY2VudGVyWCwgY2VudGVyWSk7XG4gICAgICAgIGNvbnN0IHNjYWxlID0gbWluU2NhbGUgKyAoMSAtIGRpc3RhbmNlIC8gbWF4RGlzdGFuY2UpICogKG1heFNjYWxlIC0gbWluU2NhbGUpO1xuICAgICAgICBlbGVtZW50LnN0eWxlLnRyYW5zZm9ybSA9IGBzY2FsZSgke01hdGgubWluKG1heFNjYWxlLCBNYXRoLm1heChtaW5TY2FsZSwgc2NhbGUpKX0pYDtcbiAgICB9KTtcblxuICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsICgpID0+IHtcbiAgICAgICAgZWxlbWVudC5zdHlsZS50cmFuc2Zvcm0gPSBgc2NhbGUoJHttaW5TY2FsZX0pYDtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gc2hvd1dpbkxpbmUoY29tYm8pIHtcbiAgICBjb25zdCBsaW5lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLndpbi1saW5lJyk7XG4gICAgbGluZS5zdHlsZS50cmFuc2Zvcm0gPSAnc2NhbGVYKDApJztcbiAgICAvLyBsaW5lLnN0eWxlLndpZHRoID0gJzEwMCUnO1xuICAgIC8vIGxpbmUuc3R5bGUuaGVpZ2h0ID0gJzQ0cHgnO1xuICAgIC8vIGxpbmUuc3R5bGUuYmFja2dyb3VuZCA9ICcjMDBmMGZmJztcblxuICAgIGNvbnN0IHBvc2l0aW9ucyA9IHtcbiAgICAgICAgJzAsMSwyJzogeyB0b3A6ICcyNiUnLCBsZWZ0OiAnNTAlJywgcm90YXRlOiAnMGRlZycsIHdpZHRoOiAnODAlJyB9LFxuICAgICAgICAnMyw0LDUnOiB7IHRvcDogJzUwJScsIGxlZnQ6ICc1MCUnLCByb3RhdGU6ICcwZGVnJywgd2lkdGg6ICc4MCUnIH0sXG4gICAgICAgICc2LDcsOCc6IHsgdG9wOiAnNzguMzMlJywgbGVmdDogJzUwJScsIHJvdGF0ZTogJzBkZWcnLCB3aWR0aDogJzgwJScgfSxcbiAgICAgICAgJzAsMyw2JzogeyB0b3A6ICc1MCUnLCBsZWZ0OiAnMjQuNSUnLCByb3RhdGU6ICc5MGRlZycsIHdpZHRoOiAnODAlJ30sXG4gICAgICAgICcxLDQsNyc6IHsgdG9wOiAnNTAlJywgbGVmdDogJzUwJScsIHJvdGF0ZTogJzkwZGVnJywgd2lkdGg6ICc4MCUnIH0sXG4gICAgICAgICcyLDUsOCc6IHsgdG9wOiAnNTAlJywgbGVmdDogJzc2LjUlJywgcm90YXRlOiAnOTBkZWcnLCB3aWR0aDogJzgwJScgfSxcbiAgICAgICAgJzAsNCw4JzogeyB0b3A6ICc1MCUnLCBsZWZ0OiAnNTAlJywgcm90YXRlOiAnNDVkZWcnLCB3aWR0aDogJzEwMCUnIH0sXG4gICAgICAgICcyLDQsNic6IHsgdG9wOiAnNTAlJywgbGVmdDogJzUwJScsIHJvdGF0ZTogJy00NWRlZycsIHdpZHRoOiAnMTAwJScgfSxcbiAgICB9O1xuXG4gICAgY29uc3Qga2V5ID0gY29tYm8uc29ydCgoYSwgYikgPT4gYSAtIGIpLmpvaW4oJywnKTtcblxuICAgIGNvbnNvbGUubG9nKGtleSk7XG5cbiAgICBjb25zdCBwb3MgPSBwb3NpdGlvbnNba2V5XTtcblxuICAgIGNvbnNvbGUubG9nKHBvcy53aWR0aCk7XG5cbiAgICBsZXQgd2lkdGggPSBwb3Mud2lkdGg7XG5cbiAgICBpZiAocG9zKSB7XG4gICAgICAgIGxpbmUuc3R5bGUudG9wID0gcG9zLnRvcDtcbiAgICAgICAgbGluZS5zdHlsZS5sZWZ0ID0gcG9zLmxlZnQ7XG4gICAgICAgIGxpbmUuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZSgtNTAlLCAtNTAlKSByb3RhdGUoJHtwb3Mucm90YXRlfSkgc2NhbGVYKDEpYDtcbiAgICAgICAgbGluZS5zdHlsZS53aWR0aCA9IGAke3Bvcy53aWR0aH1gO1xuICAgICAgICBsaW5lLnN0eWxlLm9wYWNpdHkgPSBgMWA7XG4gICAgfVxufVxuXG4vLy8vIHRlc3RcbmNvbnN0IHRlc3RQb3B1cEJ1dHRvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudGVzdC1wb3B1cCcpO1xudGVzdFBvcHVwQnV0dG9ucy5mb3JFYWNoKGJ1dHRvbiA9PiB7XG4gICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBwb3B1cENsYXNzID0gYnV0dG9uLmRhdGFzZXQucG9wdXA7XG4gICAgICAgIGNvbnN0IHBvcHVwID0gb3ZlcmxheS5xdWVyeVNlbGVjdG9yKHBvcHVwQ2xhc3MpO1xuICAgICAgICBjb25zdCBhbGxQb3B1cHMgPSBvdmVybGF5LnF1ZXJ5U2VsZWN0b3JBbGwoJy5wb3B1cCcpO1xuICAgICAgICBjb25zdCBpc0FscmVhZHlPcGVuID0gIXBvcHVwLmNsYXNzTGlzdC5jb250YWlucygnaGlkZS1wb3B1cCcpO1xuXG4gICAgICAgIGlmIChpc0FscmVhZHlPcGVuKSB7XG4gICAgICAgICAgICBvdmVybGF5LmNsYXNzTGlzdC5hZGQoJ29wYWNpdHknKTtcbiAgICAgICAgICAgIHBvcHVwLmNsYXNzTGlzdC5hZGQoJ2hpZGUtcG9wdXAnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFsbFBvcHVwcy5mb3JFYWNoKHAgPT4gcC5jbGFzc0xpc3QuYWRkKCdoaWRlLXBvcHVwJykpO1xuICAgICAgICAgICAgb3ZlcmxheS5jbGFzc0xpc3QucmVtb3ZlKCdvcGFjaXR5Jyk7XG4gICAgICAgICAgICBwb3B1cC5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlLXBvcHVwJyk7XG4gICAgICAgIH1cbiAgICB9KTtcbn0pO1xuXG5cbi8vINCU0L7QtNCw0ZTQvNC+INGG0LXQuSDQutC+0LQg0LIg0LrRltC90LXRhtGMINCy0LDRiNC+0LPQviDRltGB0L3Rg9GO0YfQvtCz0L4g0YHQutGA0LjQv9GC0LBcblxuLy8g0KHRgtCy0L7RgNGO0ZTQvNC+INCy0LjQv9Cw0LTQsNGO0YfQtSDQvNC10L3RjiDQtNC70Y8g0YLQtdGB0YLQvtCy0LjRhSDRgdGG0LXQvdCw0YDRltGX0LJcbmNvbnN0IHRlc3RNZW51ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG50ZXN0TWVudS5jbGFzc05hbWUgPSAndGVzdC1kcm9wZG93bic7XG50ZXN0TWVudS5pbm5lckhUTUwgPSBgXG4gIDxidXR0b24gY2xhc3M9XCJ0ZXN0LWRyb3Bkb3duLWJ0blwiPtCi0LXRgdGCINGB0YbQtdC90LDRgNGW0ZfQsiDilrw8L2J1dHRvbj5cbiAgPGRpdiBjbGFzcz1cInRlc3QtZHJvcGRvd24tY29udGVudFwiPlxuICAgIDxidXR0b24gY2xhc3M9XCJ0ZXN0LXNjZW5hcmlvXCIgZGF0YS1zY2VuYXJpbz1cIndpblwiPtCi0LXRgdGCIFdpbjwvYnV0dG9uPlxuICAgIDxidXR0b24gY2xhc3M9XCJ0ZXN0LXNjZW5hcmlvXCIgZGF0YS1zY2VuYXJpbz1cImxvc2VcIj7QotC10YHRgiBMb3NlPC9idXR0b24+XG4gICAgPGJ1dHRvbiBjbGFzcz1cInRlc3Qtc2NlbmFyaW9cIiBkYXRhLXNjZW5hcmlvPVwiZHJhd1wiPtCi0LXRgdGCIERyYXc8L2J1dHRvbj5cbiAgICA8YnV0dG9uIGNsYXNzPVwidGVzdC1zY2VuYXJpb1wiIGRhdGEtc2NlbmFyaW89XCJyZXNldFwiPtCh0LrQuNC90YPRgtC4INCz0YDRgzwvYnV0dG9uPlxuICA8L2Rpdj5cbmA7XG5cbi8vINCU0L7QtNCw0ZTQvNC+INGB0YLQuNC70ZYg0LTQu9GPINCy0LjQv9Cw0LTQsNGO0YfQvtCz0L4g0LzQtdC90Y5cbmNvbnN0IHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbnN0eWxlLnRleHRDb250ZW50ID0gYFxuICAudGVzdC1kcm9wZG93biB7XG4gICAgei1pbmRleDogOTk5OTtcbiAgfVxuXG4gIC50ZXN0LWRyb3Bkb3duLWJ0biB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogIzRDQUY1MDtcbiAgICBjb2xvcjogd2hpdGU7XG4gICAgcGFkZGluZzogMTBweDtcbiAgICBmb250LXNpemU6IDE2cHg7XG4gICAgYm9yZGVyOiBub25lO1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICBib3JkZXItcmFkaXVzOiA0cHg7XG4gIH1cblxuICAudGVzdC1kcm9wZG93bi1jb250ZW50IHtcbiAgICBkaXNwbGF5OiBub25lO1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjlmOWY5O1xuICAgIG1pbi13aWR0aDogMTYwcHg7XG4gICAgYm94LXNoYWRvdzogMHB4IDhweCAxNnB4IDBweCByZ2JhKDAsMCwwLDAuMik7XG4gICAgei1pbmRleDogMTtcbiAgICBib3JkZXItcmFkaXVzOiA0cHg7XG4gICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgfVxuXG4gIC50ZXN0LWRyb3Bkb3duLWNvbnRlbnQgYnV0dG9uIHtcbiAgICBjb2xvcjogYmxhY2s7XG4gICAgcGFkZGluZzogMTJweCAxNnB4O1xuICAgIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcbiAgICBkaXNwbGF5OiBibG9jaztcbiAgICB3aWR0aDogMTAwJTtcbiAgICB0ZXh0LWFsaWduOiBsZWZ0O1xuICAgIGJvcmRlcjogbm9uZTtcbiAgICBiYWNrZ3JvdW5kOiBub25lO1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgfVxuXG4gIC50ZXN0LWRyb3Bkb3duLWNvbnRlbnQgYnV0dG9uOmhvdmVyIHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjFmMWYxO1xuICB9XG5cbiAgLnRlc3QtZHJvcGRvd246aG92ZXIgLnRlc3QtZHJvcGRvd24tY29udGVudCB7XG4gICAgZGlzcGxheTogYmxvY2s7XG4gIH1cbmA7XG5cbmRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi50ZXN0LW1lbnVcIikuYXBwZW5kQ2hpbGQodGVzdE1lbnUpO1xuXG4vLyDQpNGD0L3QutGG0ZbRjyDQtNC70Y8g0YHQuNC80YPQu9GP0YbRltGXINCy0LjQs9GA0LDRiNGDXG5mdW5jdGlvbiBzaW11bGF0ZVdpbigpIHtcbiAgICAvLyDQntGH0LjRidCw0ZTQvNC+INC00L7RiNC60YNcbiAgICBib2FyZCA9IFsnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnXTtcblxuICAgIC8vINCS0YHRgtCw0L3QvtCy0LvRjtGU0LzQviDQstC40LPRgNCw0YjQvdGDINC60L7QvNCx0ZbQvdCw0YbRltGOINC00LvRjyDQs9GA0LDQstGG0Y9cbiAgICBib2FyZFswXSA9ICfQk9GA0LDQstC10YbRjCAwMSc7XG4gICAgYm9hcmRbMV0gPSAn0JPRgNCw0LLQtdGG0YwgMDEnO1xuICAgIGJvYXJkWzJdID0gJ9CT0YDQsNCy0LXRhtGMIDAxJztcblxuICAgIC8vINCe0L3QvtCy0LvRjtGU0LzQviBVSVxuICAgIGNlbGxzLmZvckVhY2goKGNlbGwsIGluZGV4KSA9PiB7XG4gICAgICAgIC8vIGNlbGwudGV4dENvbnRlbnQgPSAnJztcbiAgICAgICAgY2VsbC5jbGFzc0xpc3QucmVtb3ZlKCd0YWtlbicsICdYLXBsYXllcicsICdPLXBsYXllcicpO1xuXG4gICAgICAgIGlmIChib2FyZFtpbmRleF0gPT09ICfQk9GA0LDQstC10YbRjCAwMScpIHtcbiAgICAgICAgICAgIC8vIGNlbGwudGV4dENvbnRlbnQgPSAnWCc7XG4gICAgICAgICAgICBjZWxsLmNsYXNzTGlzdC5hZGQoJ1gtcGxheWVyJywgJ3Rha2VuJyk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vINCf0L7QutCw0LfRg9GU0LzQviDQu9GW0L3RltGOINC/0LXRgNC10LzQvtCz0LhcbiAgICBzaG93V2luTGluZShbMCwgMSwgMl0pO1xuXG4gICAgLy8g0JfQsNC/0YPRgdC60LDRlNC80L4g0LDQvdGW0LzQsNGG0ZbRjiDQt9Cw0LLQtdGA0YjQtdC90L3RjyDQs9GA0LhcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgc3RhdHVzVGV4dC50ZXh0Q29udGVudCA9ICfQk9GA0LDQstC10YbRjCAwMSc7XG4gICAgICAgIGhpZGVBZnRlckdhbWUoXCJ3aW5cIik7XG4gICAgICAgIGVuZEdhbWUoKTtcbiAgICB9LCAxMDAwKTtcbn1cblxuLy8g0KTRg9C90LrRhtGW0Y8g0LTQu9GPINGB0LjQvNGD0LvRj9GG0ZbRlyDQv9GA0L7Qs9GA0LDRiNGDXG5mdW5jdGlvbiBzaW11bGF0ZUxvc2UoKSB7XG4gICAgLy8g0J7Rh9C40YnQsNGU0LzQviDQtNC+0YjQutGDXG4gICAgYm9hcmQgPSBbJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJ107XG5cbiAgICAvLyDQktGB0YLQsNC90L7QstC70Y7RlNC80L4g0LLQuNCz0YDQsNGI0L3RgyDQutC+0LzQsdGW0L3QsNGG0ZbRjiDQtNC70Y8g0LrQvtC80L8n0Y7RgtC10YDQsFxuICAgIGJvYXJkWzNdID0gJ9CT0YDQsNCy0LXRhtGMIDAyJztcbiAgICBib2FyZFs0XSA9ICfQk9GA0LDQstC10YbRjCAwMic7XG4gICAgYm9hcmRbNV0gPSAn0JPRgNCw0LLQtdGG0YwgMDInO1xuXG4gICAgLy8g0J7QvdC+0LLQu9GO0ZTQvNC+IFVJXG4gICAgY2VsbHMuZm9yRWFjaCgoY2VsbCwgaW5kZXgpID0+IHtcbiAgICAgICAgLy8gY2VsbC50ZXh0Q29udGVudCA9ICcnO1xuICAgICAgICBjZWxsLmNsYXNzTGlzdC5yZW1vdmUoJ3Rha2VuJywgJ1gtcGxheWVyJywgJ08tcGxheWVyJyk7XG5cbiAgICAgICAgaWYgKGJvYXJkW2luZGV4XSA9PT0gJ9CT0YDQsNCy0LXRhtGMIDAyJykge1xuICAgICAgICAgICAgLy8gY2VsbC50ZXh0Q29udGVudCA9ICdPJztcbiAgICAgICAgICAgIGNlbGwuY2xhc3NMaXN0LmFkZCgnTy1wbGF5ZXInLCAndGFrZW4nKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8g0J/QvtC60LDQt9GD0ZTQvNC+INC70ZbQvdGW0Y4g0L/QtdGA0LXQvNC+0LPQuFxuICAgIHNob3dXaW5MaW5lKFszLCA0LCA1XSk7XG5cbiAgICAvLyDQl9Cw0L/Rg9GB0LrQsNGU0LzQviDQsNC90ZbQvNCw0YbRltGOINC30LDQstC10YDRiNC10L3QvdGPINCz0YDQuFxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBzdGF0dXNUZXh0LnRleHRDb250ZW50ID0gJ9CT0YDQsNCy0LXRhtGMIDAyJztcbiAgICAgICAgaGlkZUFmdGVyR2FtZShcImxvc2VcIik7XG4gICAgICAgIGVuZEdhbWUoKTtcbiAgICB9LCAxMDAwKTtcbn1cblxuLy8g0KTRg9C90LrRhtGW0Y8g0LTQu9GPINGB0LjQvNGD0LvRj9GG0ZbRlyDQvdGW0YfQuNGXXG5mdW5jdGlvbiBzaW11bGF0ZURyYXcoKSB7XG4gICAgLy8g0J7Rh9C40YnQsNGU0LzQviDQtNC+0YjQutGDXG4gICAgYm9hcmQgPSBbJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJ107XG5cbiAgICAvLyDQktGB0YLQsNC90L7QstC70Y7RlNC80L4g0L3RltGH0LjQudC90YMg0LTQvtGI0LrRg1xuICAgIGJvYXJkWzBdID0gJ9CT0YDQsNCy0LXRhtGMIDAxJztcbiAgICBib2FyZFsxXSA9ICfQk9GA0LDQstC10YbRjCAwMic7XG4gICAgYm9hcmRbMl0gPSAn0JPRgNCw0LLQtdGG0YwgMDEnO1xuICAgIGJvYXJkWzNdID0gJ9CT0YDQsNCy0LXRhtGMIDAxJztcbiAgICBib2FyZFs0XSA9ICfQk9GA0LDQstC10YbRjCAwMic7XG4gICAgYm9hcmRbNV0gPSAn0JPRgNCw0LLQtdGG0YwgMDEnO1xuICAgIGJvYXJkWzZdID0gJ9CT0YDQsNCy0LXRhtGMIDAyJztcbiAgICBib2FyZFs3XSA9ICfQk9GA0LDQstC10YbRjCAwMSc7XG4gICAgYm9hcmRbOF0gPSAn0JPRgNCw0LLQtdGG0YwgMDInO1xuXG4gICAgLy8g0J7QvdC+0LLQu9GO0ZTQvNC+IFVJXG4gICAgY2VsbHMuZm9yRWFjaCgoY2VsbCwgaW5kZXgpID0+IHtcbiAgICAgICAgLy8gY2VsbC50ZXh0Q29udGVudCA9ICcnO1xuICAgICAgICBjZWxsLmNsYXNzTGlzdC5yZW1vdmUoJ3Rha2VuJywgJ1gtcGxheWVyJywgJ08tcGxheWVyJyk7XG5cbiAgICAgICAgaWYgKGJvYXJkW2luZGV4XSA9PT0gJ9CT0YDQsNCy0LXRhtGMIDAxJykge1xuICAgICAgICAgICAgLy8gY2VsbC50ZXh0Q29udGVudCA9ICdYJztcbiAgICAgICAgICAgIGNlbGwuY2xhc3NMaXN0LmFkZCgnWC1wbGF5ZXInLCAndGFrZW4nKTtcbiAgICAgICAgfSBlbHNlIGlmIChib2FyZFtpbmRleF0gPT09ICfQk9GA0LDQstC10YbRjCAwMicpIHtcbiAgICAgICAgICAgIC8vIGNlbGwudGV4dENvbnRlbnQgPSAnTyc7XG4gICAgICAgICAgICBjZWxsLmNsYXNzTGlzdC5hZGQoJ08tcGxheWVyJywgJ3Rha2VuJyk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vINCX0LDQv9GD0YHQutCw0ZTQvNC+INCw0L3RltC80LDRhtGW0Y4g0LfQsNCy0LXRgNGI0LXQvdC90Y8g0LPRgNC4XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHN0YXR1c1RleHQudGV4dENvbnRlbnQgPSBcItCd0ZbRh9C40Y8hXCI7XG4gICAgICAgIGhpZGVBZnRlckdhbWUoXCJkcmF3XCIpO1xuICAgIH0sIDEwMDApO1xufVxuXG4vLyDQntCx0YDQvtCx0L3QuNC6INC60LvRltC60ZbQsiDQtNC70Y8g0YLQtdGB0YLQvtCy0LjRhSDRgdGG0LXQvdCw0YDRltGX0LJcbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50ZXN0LXNjZW5hcmlvJykuZm9yRWFjaChidG4gPT4ge1xuICAgIGJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICAgIGNvbnN0IHNjZW5hcmlvID0gZS50YXJnZXQuZGF0YXNldC5zY2VuYXJpbztcblxuICAgICAgICBzd2l0Y2goc2NlbmFyaW8pIHtcbiAgICAgICAgICAgIGNhc2UgJ3dpbic6XG4gICAgICAgICAgICAgICAgc2ltdWxhdGVXaW4oKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2xvc2UnOlxuICAgICAgICAgICAgICAgIHNpbXVsYXRlTG9zZSgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnZHJhdyc6XG4gICAgICAgICAgICAgICAgc2ltdWxhdGVEcmF3KCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdyZXNldCc6XG4gICAgICAgICAgICAgICAgaW5pdGlhbGl6ZUdhbWUoKTtcbiAgICAgICAgICAgICAgICBnYW1lT3ZlclRleHQudGV4dENvbnRlbnQgPSBgYDtcbiAgICAgICAgICAgICAgICBnYW1lR3JpZC5zdHlsZS5vcGFjaXR5ID0gXCIxXCI7XG4gICAgICAgICAgICAgICAgZ2FtZUNvbnRhaW5lci5zdHlsZS5vcGFjaXR5ID0gXCIxXCI7XG4gICAgICAgICAgICAgICAgcGVyc0xlZnQuc3R5bGUudHJhbnNmb3JtID0gXCJ0cmFuc2xhdGVYKDAlKVwiO1xuICAgICAgICAgICAgICAgIHBlcnNSaWdodC5zdHlsZS50cmFuc2Zvcm0gPSBcInRyYW5zbGF0ZVgoMCUpIHNjYWxlKC0xLCAxKVwiO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8g0KXQvtCy0LDRlNC80L4g0LLQuNC/0LDQtNCw0Y7Rh9C1INC80LXQvdGOINC/0ZbRgdC70Y8g0LLQuNCx0L7RgNGDXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50ZXN0LWRyb3Bkb3duLWNvbnRlbnQnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIH0pO1xufSk7XG5cbi8vINCl0L7QstCw0ZTQvNC+INCy0LjQv9Cw0LTQsNGO0YfQtSDQvNC10L3RjiDQv9GA0Lgg0LrQu9GW0LrRgyDQv9C+0LfQsCDQvdC40LxcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcblxuICAgIGNvbnNvbGUubG9nKGUudGFyZ2V0KTtcbiAgICBpZiAoIWUudGFyZ2V0LmNsb3Nlc3QoJy50ZXN0LWRyb3Bkb3duJykpIHtcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRlc3QtZHJvcGRvd24tY29udGVudCcpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgfWVsc2V7XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50ZXN0LWRyb3Bkb3duLWNvbnRlbnQnKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICB9XG59KTtcblxuZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi50ZXN0LWJ0blwiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRlc3QtbWVudScpLmNsYXNzTGlzdC50b2dnbGUoJ2hpZGUnKTtcbn0pXG5cbi8vLy8vIHRlc3RcbiJdfQ==
