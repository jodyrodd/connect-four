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

    playerMove(col) {
        console.log("Player Move " + col);
        this.move(PLAYER, col);
        this.computerMove();
    }

    computerMove() {
        var col = 0;
        console.log("Computer Move " + col);
        this.move(COMPUTER, col);
    }

    move(owner, col) {
        console.log("Move received player - " + owner + " column - " + col);
        for(var i=5; i >= 0; i--) {
            if(this.getOwner(i, col) === UNCLAIMED) {
                //unowned cell
                console.log("empty cell at row=" + i + ", col = " col);
                this.setOwner(i, col, owner);
                break;
            }
        }
        this.checkForWin();
    }

    checkForWin() {
        console.log("checking for a win");
    }

}