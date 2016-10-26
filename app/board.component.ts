import { Component, Input } from '@angular/core';
import { Board } from './board';

@Component({
  selector: 'game-board',
  template: `
  <table id="board"><tbody>
    <game-head (notifyParent)="getColumnClick($event)"></game-head>
    <tr *ngFor="let row of board.rows">
      <game-row [row]="row"></game-row>
    </tr>
  </tbody></table>
  `
})
export class GameBoardComponent {
    board = new Board;

    getColumnClick(col) {
        console.log("received event " + col);
        this.board.playerMove(col);
    }
}
