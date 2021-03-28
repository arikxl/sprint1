'use strict'

const MINE = '💫';
const FLAG = '🚩';
const EMPTY = ' ';

var gMinesOnBoard = [];
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
    bestScore: Infinity,
    safeClicks: 3,
    isNew: true
}

var gLevel = {
    SIZE: 4,
    MINES: 2
};

function initGame(size, mines) {
    clearInterval(gameInterval);
    gMinesOnBoard = [];
    gGame.isNew = true;
    gGame.isOn = true;
    gLevel.SIZE = size;
    gLevel.MINES = mines;
    gGame.markedCount = 0;
    elBackground.style.backgroundImage = 'url(img/1.png)';
    elLives.innerText = '❤❤❤';
    gGame.secsPassed = 0;
    gGame.lives = 3;
    gBoard = buildBoard(size);
    document.querySelector('.timer span').innerText = gGame.secsPassed;
    document.querySelector('.field').innerHTML = renderBoard(gBoard);


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
        // console.log('cellHTML:', cellHTML)
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
        gMinesOnBoard.push(gBoard[emptyPosition.i][emptyPosition.j]);
    }
}

function cellClicked(elCell) {
    var location = elCell.classList.value.split('-');
    var iIndex = +location[1];
    var jIndex = +location[2];
    var minesTest = gBoard[iIndex][jIndex];
    if (minesTest.isChecked) return
    if (minesTest.isShown) return
    if (!gGame.isOn) return
    if (gGame.isNew) {
        addMine(gLevel.MINES);
        startTimer();
        document.querySelector('.timer span').innerText = gGame.secsPassed;
        gGame.isNew = false;
    }

    if (minesTest.isMine && !minesTest.isShown) {
        elCell.innerText = MINE;
        clickedOnMine()
    } else if (!minesTest.isShown) {
        minesTest.minesAroundCount = countNeighbors(gBoard, iIndex, jIndex);
        elCell.innerText = countNeighbors(gBoard, iIndex, jIndex);
        if (!minesTest.minesAroundCount && !minesTest.isMine) {
            revealNeighbors(iIndex, jIndex);
        }
    }
    minesTest.isShown = true;
    gGame.shownCount++
    checkGameOver()
    // console.log('gGame.isNew:', gGame.isNew)

}

// function revealNeighbors(iIndex, jIndex) {
//     if (gBoard[iIndex][jIndex].isMine) return
//     for (var i = iIndex - 1; i <= iIndex + 1; i++) {
//         if (i < 0 || i >= gBoard.length) continue;
//         for (var j = jIndex - 1; j <= jIndex + 1; j++) {
//             if (i === iIndex && j === jIndex) continue;
//             if (j < 0 || j >= gBoard.length) continue;
//             var neighborCell = gBoard[i][j];
//             if (!neighborCell.isMine && !neighborCell.isShown && !neighborCell.isMarked) {
//                 neighborCell.isShown = true;
//                 gGame.shownCount++;
//                 if (neighborCell.minesAroundCount > 1) revealNeighbors(i, j);
//             }
//         }
//     }
// }

function revealNeighbors(iIndex, jIndex) {
    for (var i = iIndex - 1; i <= iIndex + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = jIndex - 1; j <= jIndex + 1; j++) {
            if (i === jIndex && j === jIndex) continue;
            if (j < 0 || j >= gBoard[i].length) continue;
            var elCell = document.querySelector(`.cell-${i}-${j}`);
            cellClicked(elCell);
            gBoard[i][j].isShown = true;
            // revealNeighbors(iIndex, jIndex)
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
    // console.log('gGame.shownCount:', gGame.shownCount)
    // console.log('gGame.markedCount:', gGame.markedCount)
    if (gGame.markedCount + gGame.shownCount === gBoard.length * gBoard.length) {
        alert('YOU WON!');
        saveBestTime()
        elBackground.style.backgroundImage = 'url(img/2.png)'
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
        revealBombs()
        saveBestTime()
        clearInterval(gameInterval);
        elBackground.style.backgroundImage = 'url(img/3.png)';
        elLives.innerText = '🤯';
        gGame.isOn = false;
    }
}

function revealBombs() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].isMine) {
                var elBomb = document.querySelector(`.cell-${i}-${j}`);
                elBomb.innerText = MINE;
            }
        }
    }
}