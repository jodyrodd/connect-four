import { Component, OnInit } from '@angular/core';
import { BoardService } from './board.service';
import { Board, COMPUTER } from './board';
import { AiPlayer } from './ai';


@Component({
  selector: 'my-app',
  template: `
    <h1>{{title}}</h1>
    <div class="row">
        <div class="col-md-4">
        <div *ngIf="board.winner == undefined">
            <h3>{{board.currentPlayerText}}'s Turn
                <img src="./ajax-loader.gif" *ngIf="board.currentPlayer">
            </h3>
        </div>
        <div *ngIf="board.winner">
            <h2>{{board.winner}} wins!</h2>
        </div>
        <game-board [board]="board" [aiPlayer]="aiPlayer"></game-board>
        </div>
        <div class="col-md-4">
            <div><button (click)="restartGame()">New Game</button>
            <div>
                AI Difficulty (depth search):
                <input type="number" min="1" max="8" [(ngModel)]="aiPlayer.maxDepth" />
            </div>
        </div>
    </div>
    `,
    providers: [BoardService]
})
export class AppComponent {
    title = 'Connect 4';
    board: Board;
    aiPlayer = new AiPlayer;

    constructor(private boardService: BoardService) {}

    ngOnInit(): void {
        this.board = this.boardService.newBoard();
    }

    restartGame() {
        this.board = this.boardService.newBoard();
    }
}
