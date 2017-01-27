'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

document.addEventListener('DOMContentLoaded', function () {
  var app = document.getElementById('app'),
      wrapper = document.getElementById('wrapper');
  var homePage = wrapper.innerHTML,
      gameState = {},
      minimaxScores = { 'X': 1, 'O': -1, 'draw': 0 };

  // Game constructor

  var Game = function () {
    function Game(gameState) {
      _classCallCheck(this, Game);

      var player1 = gameState.player1;
      var otherPlayer = gameState.numPlayers == 1 ? 'Computer' : 'Player 2';
      this.players = {};
      if (player1 == 'X') {
        this.players['X'] = 'Player 1';
        this.players['O'] = otherPlayer;
      } else {
        this.players['O'] = 'Player 1';
        this.players['X'] = otherPlayer;
      }
    }

    Game.prototype.compMove = function compMove() {
      var mmMove = minimax(this.boardArr, this.currentPlayer)[1].reverse();
      this.move(mmMove.join(', '));
    };

    Game.prototype.end = function end(result) {
      result.squares.forEach(function (loc) {
        document.querySelector('[data-loc="' + loc + '"]').classList.add('won');
      });
      setTimeout(this.start.bind(this), 1000);
    };

    Game.prototype.firstMove = function firstMove() {
      if (this.players.X == 'Computer') {
        this.move('1, 1');
      } else {
        (function () {
          var message = document.createElement('p');
          message.classList.add('message');
          message.innerHTML = 'X goes first.';
          wrapper.insertBefore(message, wrapper.firstChild);
          setTimeout(function () {
            message.classList.add('appear');
            setTimeout(function () {
              message.classList.remove('appear');
            }, 1250);
          }, 250);
        })();
      }
    };

    Game.prototype.handleClick = function handleClick(e) {
      e.preventDefault();
      if (e.target.innerHTML == '' && this.won == false) this.move(e.target.dataset.loc);
    };

    Game.prototype.move = function move(loc) {
      var square = document.querySelector('[data-loc="' + loc + '"]');
      if (this.currentPlayer == 'O') square.classList.add('O');
      square.innerHTML = this.currentPlayer;
      var locArr = loc.split(', ');
      this.boardArr[locArr[1]][locArr[0]] = this.currentPlayer;
      if (checkWin(this.boardArr).player != 'none') {
        this.won = true;
        this.end(checkWin(this.boardArr));
      } else {
        this.currentPlayer = this.currentPlayer == 'X' ? 'O' : 'X';
        if (this.players[this.currentPlayer] == 'Computer') this.compMove();
      }
    };

    Game.prototype.renderBoard = function renderBoard() {
      var _this = this;

      this.boardArr = [['', '', ''], ['', '', ''], ['', '', '']];
      wrapper.innerHTML = '';
      this.currentPlayer = 'X';
      var board = document.createElement('table');
      for (var y = 0; y < 3; y++) {
        var row = document.createElement('tr');
        for (var x = 0; x < 3; x++) {
          var col = document.createElement('td');
          col.setAttribute('data-loc', x + ', ' + y);
          col.addEventListener('click', function (e) {
            return _this.handleClick(e);
          });
          row.appendChild(col);
        }
        board.appendChild(row);
      }
      var filler = document.createElement('div');
      filler.setAttribute('id', 'filler');
      wrapper.appendChild(filler);
      wrapper.appendChild(board);
    };

    Game.prototype.start = function start() {
      this.won = false;
      this.renderBoard();
      setTimeout(this.firstMove.bind(this), 250);
    };

    return Game;
  }();

  // helper functions

  var checkWin = function checkWin(board) {
    var players = ['X', 'O'];
    for (var _iterator = players, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var player = _ref;

      for (var i = 0; i < 3; i++) {
        if (board[i][0] == player && board[i][1] == player && board[i][2] == player) {
          return { 'player': player, 'squares': ['0, ' + i, '1, ' + i, '2, ' + i] };
        }
        if (board[0][i] == player && board[1][i] == player && board[2][i] == player) {
          return { 'player': player, 'squares': [i + ', 0', i + ', 1', i + ', 2'] };
        }
      }
      if (board[0][0] == player && board[1][1] == player && board[2][2] == player) {
        return { 'player': player, 'squares': ['0, 0', '1, 1', '2, 2'] };
      }
      if (board[0][2] == player && board[1][1] == player && board[2][0] == player) {
        return { 'player': player, 'squares': ['2, 0', '1, 1', '0, 2'] };
      }
    }
    if (getEmptySquares(board).length === 0) {
      return { 'player': 'draw', 'squares': [] };
    }
    return { 'player': 'none', 'squares': [] };
  };

  var getEmptySquares = function getEmptySquares(board) {
    var empties = [];
    for (var y = 0; y < board.length; y++) {
      for (var x = 0; x < board[y].length; x++) {
        if (board[y][x] == '') empties.push([y, x]);
      }
    }
    return empties;
  };

  var minimax = function minimax(board, player) {
    if (checkWin(board).player != 'none') {
      return [minimaxScores[checkWin(board).player], [-1, -1]];
    } else {
      var moves = [];
      for (var _iterator2 = getEmptySquares(board), _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
        var _ref2;

        if (_isArray2) {
          if (_i2 >= _iterator2.length) break;
          _ref2 = _iterator2[_i2++];
        } else {
          _i2 = _iterator2.next();
          if (_i2.done) break;
          _ref2 = _i2.value;
        }

        var square = _ref2;

        var boardClone = JSON.parse(JSON.stringify(board));
        boardClone[square[0]][square[1]] = player;
        var otherPlayer = player == 'X' ? 'O' : 'X';
        var score = minimax(boardClone, otherPlayer)[0];
        if (score == minimaxScores[player]) return [score, square];
        moves.push([score, square]);
      }
      return moves.reduce(function (a, b) {
        return a[0] * minimaxScores[player] > b[0] * minimaxScores[player] ? a : b;
      });
    }
  };

  // event delegation
  function handleClicks(e) {
    e.preventDefault();
    if (e.target && e.target.nodeName == 'A') {
      document.documentElement.style.setProperty('--time', '.5s');
      document.documentElement.style.setProperty('--speed', 'ease-out');
      var router = {
        'One Player': loadSides,
        'Two Player': loadSides,
        'X': loadBoard,
        'O': loadBoard,
        '<i class="fa fa-arrow-left"></i> Back': loadHome
      };
      var route = e.target.innerHTML;
      router[route](e);
    }
  }

  // 'page' loaders
  function loadBoard(e) {
    gameState['player1'] = e.target.innerHTML;
    wrapper.classList.add('transparent');
    wrapper.addEventListener('transitionend', showContent);

    function showContent(e) {
      if (e.propertyName != 'opacity') return;
      wrapper.classList.remove('transparent');
      wrapper.removeEventListener('transitionend', showContent);
      var game = new Game(gameState);
      game.start();
    }
  }

  function loadHome(e) {
    wrapper.classList.add('transparent');
    wrapper.addEventListener('transitionend', showContent);

    function showContent(e) {
      if (e.propertyName != 'opacity') return;
      wrapper.classList.remove('transparent');
      wrapper.removeEventListener('transitionend', showContent);
      wrapper.innerHTML = homePage;
    }
  }

  function loadSides(e) {
    var question = undefined;
    if (e.target.innerHTML == 'One Player') {
      gameState['numPlayers'] = 1;
      question = 'Would you like to be X or O?';
    } else {
      gameState['numPlayers'] = 2;
      question = 'Player 1: Would you like X or O?';
    }
    document.documentElement.style.setProperty('--time', '1.3s');
    document.documentElement.style.setProperty('--speed', 'ease');
    wrapper.classList.add('transparent');
    wrapper.addEventListener('transitionend', showContent);

    function showContent(e) {
      if (e.propertyName != 'opacity') return;
      wrapper.classList.remove('transparent');
      wrapper.removeEventListener('transitionend', showContent);
      document.getElementById('question').innerHTML = question;
      document.getElementById('left').innerHTML = 'X';
      document.getElementById('left').classList.add('bigger');
      document.getElementById('leftCol').classList.add('col-xs-3');
      document.getElementById('leftCol').classList.remove('col-xs-offset-1');
      document.getElementById('leftCol').classList.add('col-xs-offset-3');
      document.getElementById('right').innerHTML = 'O';
      document.getElementById('right').classList.add('bigger');
      document.getElementById('rightCol').classList.add('col-xs-3');
      if (!document.getElementById('back')) {
        var back = document.createElement('a');
        back.setAttribute('href', '#');
        back.setAttribute('id', 'back');
        back.innerHTML = '<i class="fa fa-arrow-left"></i> Back';
        wrapper.appendChild(back);
      }
    }
  }

  // MAIN
  app.addEventListener('click', handleClicks);
});