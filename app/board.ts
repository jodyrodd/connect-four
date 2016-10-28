export const UNCLAIMED = 0;
export const PLAYER = -1;
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

    constructor() {
        let rows: Row[] = [];
        for(let row = 0; row < this.rowsOnBoard; row++) {
            rows.push(new Row)
        }
        this.rows = rows;
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
        this.winner = undefined;
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
        return true;
    }

    computerMove(col) {
        this.move(COMPUTER, col);
    }

    move(owner, col) {
        console.log("Move received player - " + owner + " column - " + col);
        var row;
        for(row=5; row >= 0; row--) {
            if(this.getOwner(row, col) === UNCLAIMED) {
                this.setOwner(row, col, owner);
                break;
            }
        }
        if(row !== -1) this.checkForWin(row, col, owner);
        return row;
    }

    declareWinner(owner) {
        console.log("Player " + owner + " wins!");

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

    checkForWin(tokenRow, tokenCol, owner, winCount = this.winCount) {
        console.log("checking for a win");
        var count = 0;
        var row,
            col,
            originRow,
            originCol;

        //check row
        for(col = 0; col < 7; col++) {
            if(this.getOwner(tokenRow, col) === owner) {
                count++;
            } else {
                count = 0;
            }
            if(count === winCount) {
                this.declareWinner(owner);
                return;
            }
        }

        //check col
        count = 0;
        for(row = 5;row > -1;row--) {
            if(this.getOwner(row, tokenCol) === owner) {
                count++;
            } else {
                count = 0;
            }
            if(count === winCount) {
                this.declareWinner(owner);
                return;
            }
        }


        //check diagonals
        count = 0;
        if(tokenRow < tokenCol) {
            originRow = 0;
            originCol = tokenCol - tokenRow;
        } else if (tokenRow > tokenCol) {
            originCol = 0;
            originRow = tokenRow - tokenCol;
        } else {
            originRow = 0;
            originCol = 0;
        }
        for(row = originRow, col = originCol;
            row < 6  && col < 7; row++,col++) {
            if(this.getOwner(row, col) === owner) {
                count++;
            } else {
                count = 0;
            }
            if(count === winCount) {
                this.declareWinner(owner);
                return;
            }
        }

        count = 0;
        originRow = Math.min(tokenRow+tokenCol, 5);
        originCol = tokenCol-(originRow-tokenRow);
        for(col=originCol, row=originRow;
            row > -1 && col < 7; row--,col++) {
            if(this.getOwner(row, col) === owner) {
                count++;
            } else {
                count = 0;
            }
            if(count === winCount) {
                this.declareWinner(owner);
                return;
            }
        }
    }
}