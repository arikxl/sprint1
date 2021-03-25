'use strict'

const MINE = '💫';
const FLAG = '🚩';
const EMPTY = ' ';

const smileyEmoji = '😀';
const boomEmoji = '🤯';
const winEmoji = '😎';
const hintSign = '💡';

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

initGame(4, 2)



function initGame(size, mines) {
    gGame.isOn = true;
    gLevel.SIZE = size;
    gLevel.MINES = mines;
    gGame.markedCount = 0
    gBoard = buildBoard(size);
    // console.table('gBoard:', gBoard)
    addMine(mines)
    // setInterval(timer, 1000)
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





function addMine(mines) {
    for (var i = 0; i < mines; i++) {
        var emptyCells = getEmptyCells(gBoard);
        var randIdx = getRndInteger(0, emptyCells.length);
        var emptyPosition = emptyCells[randIdx];
        gBoard[emptyPosition.i][emptyPosition.j].isMine = true;
    }
    // console.log('gLevel.MINES:', gLevel.MINES);
    document.querySelector('.field').innerHTML = renderBoard(gBoard);
    renderBoard(gBoard);
}

function cellClicked(elCell, i, j) {
    var clickedCell = gBoard[i][j];
    if (clickedCell.isChecked) return
    if (clickedCell.isShown) return

    // console.log('clickedCell:', clickedCell)
    // console.log(elCell);
    if (!gGame.isOn) return


    if (clickedCell.isMine && !clickedCell.isShown) {
        elCell.innerText = MINE;
        alert('GAME OVER!');
        // gGame.isOn = false
        // endTime()
    } else if (!clickedCell.isShown) {
        clickedCell.minesAroundCount = countNeighbors(gBoard, i, j);
        elCell.innerText = countNeighbors(gBoard, i, j);

        if (!clickedCell.minesAroundCount && !clickedCell.isMine) {
            console.log('X')
            // clickedCell.isChecked = true;
            console.log('clickedCell:', clickedCell)
            // console.log('elCell:', elCell)

            // revealNeighbors(i, j);
        }
        
    }
    clickedCell.isShown = true;
    checkGameOver()
}


function revealNeighbors(iIndex, jIndex) {
    var neighbors = [];
    for (var i = iIndex - 1; i <= iIndex + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = jIndex - 1; j <= jIndex + 1; j++) {
            if (i === jIndex && j === jIndex) continue;
            if (j < 0 || j >= gBoard[i].length) continue;
            neighbors.push(gBoard[i][j]);
            
            for (var i = 0; i < neighbors.length; i++) {
                console.log(neighbors);
                cellClicked(neighbors[i], i, j);
            }
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
        gGame.markedCount++
        gBoard[i][j].isMarked = true
        elCell.innerText = FLAG;
    }
    checkGameOver()
    console.log('gGame.markedCount:', gGame.markedCount)
}


function checkGameOver() {
    var countShown = 0;
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (gBoard[i][j].isShown) countShown++;
        }
    }
    if (gLevel.MINES === gGame.markedCount && countShown === gBoard.length * gBoard.length - gLevel.MINES) {
        alert('YOU WON!');
        gGame.isOn = false
        // endTime()
        return true;
    }
    // console.log('countShown:', countShown)
    return false;
}





// function revealNeighbors(iIndex, jIndex) {

//     for (var i = iIndex - 1; i <= iIndex + 1; i++) {
//         if (i < 0 || i >= gBoard.length) continue;
//         for (var j = jIndex - 1; j <= jIndex + 1; j++) {
//             if (i === jIndex && j === jIndex) continue;
//             if (j < 0 || j >= gBoard[i].length) continue;
//             // var elCell = document.querySelector(`.cell-${i}-${j}`);
//             console.log(gBoard[i][j])
//             //Recursion
//             // cellClicked(elCell, i, j);
//             gBoard[i][j].isShown = true;
//         }
//     }
// }
