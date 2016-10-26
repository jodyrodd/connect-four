import { Component, Input } from '@angular/core';

export class Cell {
    row: number
    col: number
    owner: number

    constructor(row,col) {
        this.row = row;
        this.col = col;
        this.owner = -1;
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
}

@Component({
  selector: 'game-board',
  template: `
  <table id="board"><tbody>
            <tr *ngFor="let row of board.rows">
                <td *ngFor="let cell of row.cells">{{cell.row}},{{cell.col}} {{cell.owner}}</td>
            </tr>
   </tbody></table>
   `
})
export class GameBoardComponent {
    board = new Board;
}
