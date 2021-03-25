'use strict'

function getEmptyCells(board) {
    var emptyCells = []
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            var cell = board[i][j]
            var position = {
                i: i,
                j: j
            }
            if (!cell.isMine) {
                emptyCells.push(position)
            }
        }
    }
    return emptyCells
}

function countNeighbors(board, iIndex, jIndex) {
    var neighborsCount = 0;
    for (var i = iIndex - 1; i <= iIndex + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = jIndex - 1; j <= jIndex + 1; j++) {
            if (j < 0 || j >= board[0].length) continue
            if (i === iIndex && j === jIndex) continue
            var cell = board[i][j]
            if (cell.isMine) neighborsCount++
        }
    }
    return neighborsCount;
}

function getRndInteger(min, max) {
    return ~~(Math.random() * (max - min + 1)) + min;
}

function startTimer() {
    gameInterval = setInterval(function () {
        gGame.secsPassed++
        document.querySelector('.timer').innerText = gGame.secsPassed;
    }, 1000);
}

function underMaintenance(){
    alert('ממש בקרוב אפשרות זו תהיה פעילה')
}