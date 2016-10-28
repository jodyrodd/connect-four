import { Component, Input } from '@angular/core';
import { Board, UNCLAIMED, PLAYER, COMPUTER } from './board';
import { AiPlayer } from './ai';

@Component({
  selector: 'game-board',
  template: `
  <table id="board"><tbody>
    <game-head (notifyParent)="getColumnClick($event)" [gameActive]="gameActive()"
      [waitingForPlayer]="waitingForPlayer()">
    </game-head>
    <tr *ngFor="let row of board.rows">
      <game-row [row]="row"></game-row>
    </tr>
  </tbody></table>
  `
})
export class GameBoardComponent {
    @Input() board: Board;
    aiPlayer = new AiPlayer;

    getColumnClick(col) {
        console.log("received event " + col);
        this.board.playerMove(col);
        if(this.gameActive()) {
          this.aiPlayer.move(this.board);
        }
    }

    gameActive() {
        return (this.board.winner === undefined);
    }

    waitingForPlayer() {
      return this.board.currentPlayer === PLAYER;
    }
}
