export const UNCLAIMED = -1;
export const PLAYER = 0;
export const COMPUTER = 1;

export class Cell {
    owner: number

    constructor() {
        this.owner = UNCLAIMED;
    }

}


export class Row {
    cells: Cell[];
    cellsPerRow = 7;

    constructor() {
        let cells: Cell[] = [];
        for(let cell = 0; cell < this.cellsPerRow; cell++) {
            cells.push(new Cell);
        }
        this.cells = cells;
    }

    getRowState() {
        return this.cells.map(cell => cell.owner);
    }

    setRowState(values: number[]) {
        for(let cell = 0; cell < this.cellsPerRow; cell++) {
            this.cells[cell].owner = values[cell];
        }
    }
}

export class Board {
    rows: Row[];
    rowsOnBoard = 6;
    winCount = 4;
    winner: string;
    currentPlayer: number;
    currentPlayerText: string;
    maxScore = 10000;

    constructor() {
        let rows: Row[] = [];
        for(let row = 0; row < this.rowsOnBoard; row++) {
            rows.push(new Row)
        }
        this.rows = rows;
        this.currentPlayer = PLAYER;
        this.setCurrentPlayerText();
    }

    copy() {
        let newBoard = new Board;
        for(let row = 0; row < this.rowsOnBoard; row++) {
            newBoard.rows[row].setRowState(this.rows[row].getRowState());
        }
        return newBoard;
    }

    getOwner(row, col) {
        if(row < 0 || row > 5 || this.rows === undefined)
        {
            console.log("Help!");
        }
        return this.rows[row].cells[col].owner;
    }

    setOwner(row, col, owner) {
        this.rows[row].cells[col].owner = owner;
    }

    serializeBoard() {
        let result = "";
        this.rows.forEach(row => {
            result = result + row.getRowState().join('');
        })
        return result;
    }

    restartGame() {
        for(var row=5;row >= 0;row--) {
            for(var col=0;col<7;col++) {
                this.setOwner(row, col, UNCLAIMED);
            }
        }
        this.currentPlayer = PLAYER;
        this.winner = undefined;
    }

    changePlayer() {
        this.currentPlayer = this.currentPlayer % 2 ? PLAYER : COMPUTER;
        this.setCurrentPlayerText();
    }

    setCurrentPlayerText() {
      let curPlayer = "";
      switch(this.currentPlayer) {
        case PLAYER:
          curPlayer = "Player";
          break;
        case COMPUTER:
          curPlayer = "Computer";
          break;
      }
      this.currentPlayerText = curPlayer;
    }

    availableMoves() {
        let result = [];
        this.rows[0].cells.forEach((cell, i) => {
            if(cell.owner === UNCLAIMED) {
                result.push(i);
            }
        });
        return result;
    }

    validMove(col) {
        //check that at least one cell is open
        return this.getOwner(0, col) === UNCLAIMED;
    }

    playerMove(col) {
        if(!this.validMove(col)) return false;
        this.move(PLAYER, col);
        this.changePlayer();
    }

    computerMove(col) {
        this.move(COMPUTER, col);
        this.changePlayer();
    }

    move(owner, col) {
        var row;
        for(row=5; row >= 0; row--) {
            if(this.getOwner(row, col) === UNCLAIMED) {
                this.setOwner(row, col, owner);
                break;
            }
        }
        if(Math.abs(this.scoreBoard()) == this.maxScore) this.declareWinner(owner);
        return row;
    }

    declareWinner(owner) {
        switch(owner) {
            case UNCLAIMED:
                this.winner = undefined;
                break;
            case PLAYER:
                this.winner = "Player";
                break;
            case COMPUTER:
                this.winner = "Computer";
                break;
        }
    }

    checkForWin(row, col, deltaRow, deltaCol) {
        let player = 0;
        let computer = 0;
        let movesInARow = 0;

        for(let i = 0; i < 4; i++) {
            switch(this.getOwner(row, col)) {
                case PLAYER:
                    player++;
                    movesInARow = 0;
                    break;
                case COMPUTER:
                    computer++;
                    movesInARow++;
                    break;
            }
            row += deltaRow;
            col += deltaCol;
        }

        if(player === 4) {
            return -this.maxScore;
        } else if(computer === 4) {
            return this.maxScore;
        } else {
            return computer*Math.max(movesInARow, 1);
        }
    }

    scoreBoard() {
        let points = 0;

        //check for vertical wins/points
        for(let row = 0; row < 3; row++) {
            for(let col = 0; col < 7; col++) {
                let score = this.checkForWin(row, col, 1, 0);
                if(Math.abs(score) === this.maxScore) return score;
                points += score;
            }
        }

        //check horizontal
        for(let row = 0; row < 6; row++) {
            for(let col = 0; col < 4; col++) {
                let score = this.checkForWin(row, col, 0, 1);
                if(Math.abs(score) === this.maxScore) return score;
                points += score;
            }
        }
        //check left to right down diagonal
        for(let row = 0; row < 3; row++) {
            for(let col = 0; col < 4; col++) {
                let score = this.checkForWin(row, col, 1, 1);
                if(Math.abs(score) === this.maxScore) return score;
                points += score;
            }
        }
        //check right to left down diagonal
        for(let row = 3; row < 6; row++) {
            for(let col = 0; col < 4; col++) {
                let score = this.checkForWin(row, col, -1, 1);
                if(Math.abs(score) === this.maxScore) return score;
                points += score;
            }
        }

        return points;
    }

}