export const UNCLAIMED = -1;
export const PLAYER = 1;
export const COMPUTER = 0;

export class Cell {
    row: number
    col: number
    owner: number

    constructor(row,col) {
        this.row = row;
        this.col = col;
        this.owner = UNCLAIMED;
    }

}

export class Row {
    id: number;
    cells: Cell[];

    constructor(id) {
        this.id = id;
        this.cells = [
            new Cell(this.id, 0),
            new Cell(this.id, 1),
            new Cell(this.id, 2),
            new Cell(this.id, 3),
            new Cell(this.id, 4),
            new Cell(this.id, 5),
            new Cell(this.id, 6),
        ]
    }
}

export class Board {
    rows: Row[];
    winner: string;

    constructor() {
        this.rows = [
            new Row(0),
            new Row(1),
            new Row(2),
            new Row(3),
            new Row(4),
            new Row(5)
        ]
    }

    getOwner(row, col) {
        return this.rows[row].cells[col].owner;
    }

    setOwner(row, col, owner) {
        this.rows[row].cells[col].owner = owner;
    }

    restartGame() {
        for(var row=5;row >= 0;row--) {
            for(var col=0;col<7;col++) {
                this.setOwner(row, col, UNCLAIMED);
            }
        }
        this.winner = undefined;
    }

    validMove(col) {
        //check that at least one cell is open
        return this.getOwner(0, col) === UNCLAIMED;
    }

    playerMove(col) {
        console.log("Player Move " + col);
        if(!this.validMove(col)) return false;
        this.move(PLAYER, col);
        return true;
    }

    computerMove() {
        var col = Math.floor((Math.random() * 6) + 0);
        console.log("Computer Move " + col);
        this.move(COMPUTER, col);
    }

    move(owner, col) {
        console.log("Move received player - " + owner + " column - " + col);
        var row;
        for(row=5; row >= 0; row--) {
            if(this.getOwner(row, col) === UNCLAIMED) {
                //unowned cell
                console.log("empty cell at row=" + row + ", col = " + col);
                this.setOwner(row, col, owner);
                break;
            }
        }
        this.checkForWin(row, col, owner);
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

    checkForWin(tokenRow, tokenCol, owner) {
        console.log("checking for a win");
        var count = 0;
        var row,
            col,
            originRow,
            originCol;

        //check row
        for(col = 0; col < 7; col++) {
            console.log("row checking row="+row+" col="+col+" count="+count);
            if(this.getOwner(tokenRow, col) === owner) {
                count++;
            } else {
                count = 0;
            }
            if(count === 4) {
                this.declareWinner(owner);
                return;
            }
        }

        //check col
        count = 0;
        for(row = 5;row > -1;row--) {
            console.log("col checking row="+row+" col="+col+" count="+count);
            if(this.getOwner(row, tokenCol) === owner) {
                count++;
            } else {
                count = 0;
            }
            if(count === 4) {
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
            console.log("left diag checking row="+row+" col="+col+" count="+count);
            if(this.getOwner(row, col) === owner) {
                count++;
            } else {
                count = 0;
            }
            if(count === 4) {
                this.declareWinner(owner);
                return;
            }
        }

        count = 0;
        originRow = Math.min(tokenRow+tokenCol, 5);
        originCol = tokenCol-(originRow-tokenRow);
        for(col=originCol, row=originRow;
            row > -1 && col < 7; row--,col++) {
            console.log("right diag checking row="+row+" col="+col+" count="+count);
            if(this.getOwner(row, col) === owner) {
                count++;
            } else {
                count = 0;
            }
            if(count === 4) {
                this.declareWinner(owner);
                return;
            }
        }
    }
}