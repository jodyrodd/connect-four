import { Component, Input } from '@angular/core';
import { BoardService } from './board.service';
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
  `,
   providers: [BoardService]
})
export class GameBoardComponent {
    @Input() board: Board;
    @Input() aiPlayer: AiPlayer;

    constructor(private boardService: BoardService) {}

    getColumnClick(col) {
        if(this.board.playerMove(col) && this.gameActive()) {
          this.aiPlayer.move(this.board).then(res => {
            if(this.board.winner === undefined) {
              this.boardService.saveBoard(this.board);
            }
          });
        }
    }

    gameActive() {
        return (this.board.winner === undefined);
    }

    waitingForPlayer() {
      return this.board.currentPlayer === PLAYER;
    }
}
