import { Component, Input } from '@angular/core';
import { Board, UNCLAIMED } from './board';

@Component({
  selector: 'game-board',
  template: `
  <table id="board"><tbody>
    <game-head (notifyParent)="getColumnClick($event)" [gameActive]="gameActive()"></game-head>
    <tr *ngFor="let row of board.rows">
      <game-row [row]="row"></game-row>
    </tr>
  </tbody></table>
  `
})
export class GameBoardComponent {
    @Input()
    board: Board;

    getColumnClick(col) {
        console.log("received event " + col);
        if(this.board.playerMove(col) && this.gameActive()) {
            this.board.computerMove();
        }
    }

    gameActive() {
        return (this.board.winner === undefined);
    }
}
