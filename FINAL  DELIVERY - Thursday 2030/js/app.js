'use strict'

const MINE = '💫';
const FLAG = '🚩';
const EMPTY = ' ';

var elLives = document.querySelector('.lives span');
var elBackground = document.querySelector('body');
var gameInterval = 0;
var gBoard;

var gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    lives: 3,
    hints: 3,
    bestScore: 0,
    safeClicks: 3
}

var gLevel = {
    SIZE: 4,
    MINES: 2
};

function initGame(size, mines) {
    clearInterval(gameInterval);
    gGame.isOn = true;
    gLevel.SIZE = size;
    gLevel.MINES = mines;
    gGame.markedCount = 0;
    elBackground.style.backgroundImage='url(img/1.png)';
    elLives.innerText = '❤❤❤';
    gGame.secsPassed = -1;
    gBoard = buildBoard(size);
    addMine(mines);
    startTimer();
}

function buildBoard(size) {
    var board = [];
    for (var i = 0; i < size; i++) {
        board.push([]);
        for (var j = 0; j < size; j++) {

            var cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
                isChecked: false,
                i: i,
                j: j
            }
            board[i].push(cell);
        }
    }
    return board;
}

function renderBoard(board) {
    var cellHTML = '';
    for (var i = 0; i < board.length; i++) {
        cellHTML += '<tr>\n';
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j];
            cellHTML += `\t<td oncontextmenu='cellMarked(this,${currCell.i},${currCell.j})' 
            onClick= 'cellClicked(this,${currCell.i},${currCell.j})' class = 'cell-${i}-${j}'></td>\n`;
        }
        cellHTML += '<tr>\n';
    }
    getEmptyCells(board)
    return cellHTML;
}

function addMine(mines) {
    for (var i = 0; i < mines; i++) {
        var emptyCells = getEmptyCells(gBoard);
        var randIdx = getRndInteger(0, emptyCells.length);
        var emptyPosition = emptyCells[randIdx];
        gBoard[emptyPosition.i][emptyPosition.j].isMine = true;
    }
    document.querySelector('.field').innerHTML = renderBoard(gBoard);
    renderBoard(gBoard);
}

function cellClicked(elCell, i, j) {
    var location = elCell.classList.value.split('-');
    var iIndex = +location[1];
    var jIndex = +location[2];
    var clickedCell = gBoard[iIndex][jIndex];
    if (clickedCell.isChecked) return
    if (clickedCell.isShown) return
    if (!gGame.isOn) return
    if (clickedCell.isMine && !clickedCell.isShown) {
        elCell.innerText = MINE;
        clickedOnMine()
    } else if (!clickedCell.isShown) {
        clickedCell.minesAroundCount = countNeighbors(gBoard, iIndex, jIndex);
        elCell.innerText = countNeighbors(gBoard, iIndex, jIndex);
        if (!clickedCell.minesAroundCount && !clickedCell.isMine) {
            revealNeighbors(iIndex, jIndex);
        }
    }
    clickedCell.isShown = true;
    gGame.shownCount++
    checkGameOver()
}

function revealNeighbors(iIndex, jIndex) {
    for (var i = iIndex - 1; i <= iIndex + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = jIndex - 1; j <= jIndex + 1; j++) {
            if (i === jIndex && j === jIndex) continue;
            if (j < 0 || j >= gBoard[i].length) continue;
            var elCell = document.querySelector(`.cell-${i}-${j}`);
            cellClicked(elCell);
            gBoard[i][j].isShown = true;
        }
    }
}

function cellMarked(elCell, i, j) {
    document.addEventListener('contextmenu', event => event.preventDefault());
    if (gBoard[i][j].isShown) return;
    if (!gGame.isOn) return;
    if (gBoard[i][j].isMarked === true) {
        gGame.markedCount--;
        gBoard[i][j].isMarked = false;
        elCell.innerText = ' ';
    } else {
        gBoard[i][j].isMarked = true
        gGame.markedCount++
        elCell.innerText = FLAG;
        checkGameOver()
    }
}

function checkGameOver() {
        // לא עובד בגלל הפונקציה של חיפוש המוקשים השכנים
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (gBoard[i][j].isShown)
                gGame.shownCount++;
        }
    }
    console.log('gGame.shownCount:', gGame.shownCount)
    console.log('gGame.markedCount:', gGame.markedCount)
    if (gGame.markedCount + gGame.shownCount === gBoard.length * gBoard.length) {
        alert('YOU WON!');
        elBackground.style.backgroundImage ='url(img/3.png)'
        clearInterval(gameInterval);
        gGame.isOn = false
        return true;
    }
    return false;
}

function clickedOnMine() {
    gGame.lives--
    if (gGame.lives === 2) elLives.innerText = '❤❤';
    if (gGame.lives === 1) elLives.innerText = '❤';
    if (gGame.lives === 0) {
        clearInterval(gameInterval);
        elBackground.style.backgroundImage = 'url(img/3.png)';
        elLives.innerText = '🤯';
        gGame.isOn = false
    }

}