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
    uuid: string;

    constructor(loadBoard) {
        this.currentPlayer = loadBoard['currentPlayer'] === null ? PLAYER : loadBoard['currentPlayer'];
        this.uuid = loadBoard['uuid'];

        let rows: Row[] = [];
        let loadRows: number[][] = [];
        if(loadBoard['rows'] !== null && loadBoard['rows'] !== undefined) {
            let rows = loadBoard['rows'].split(/\[(.*?)\]/).filter(Boolean);
            for(let row of rows) {
                loadRows.push(row.split(',').map(Number));
            }
        }
        for(let row = 0; row < this.rowsOnBoard; row++) {
            rows.push(new Row)
            if(loadRows.length > 0) {
                rows[row].setRowState(loadRows[row]);
            }
        }
        this.rows = rows;
        this.currentPlayerText = this.getPlayerText();
    }

    copy() {
        let params = {
            'currentPlayer': this.currentPlayer,
            'uuid': this.uuid,
            'rows': this.serializeBoard()
        }
        let newBoard = new Board(params);
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
            result = result + "[" + row.getRowState().join(',') + "]";
        })
        return result;
    }

    changePlayer() {
        this.currentPlayer = this.currentPlayer % 2 ? PLAYER : COMPUTER;
        this.currentPlayerText = this.getPlayerText();
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
        return true;
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

    getPlayerText(player = this.currentPlayer): string {
        switch(player) {
            case PLAYER:
                return "Player";
            case COMPUTER:
                return "Computer";
        }
        return "";
    }

    declareWinner(owner) {
        this.winner = this.getPlayerText(owner);
    }

    checkForWin(row, col, deltaRow, deltaCol) {
        let player = 0;
        let computer = 0;

        for(let i = 0; i < 4; i++) {
            switch(this.getOwner(row, col)) {
                case PLAYER:
                    player++;
                    computer = 0;
                    break;
                case COMPUTER:
                    computer++;
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
            return computer;
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