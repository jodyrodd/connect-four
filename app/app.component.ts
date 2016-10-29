import { Component } from '@angular/core';
import { Board, UNCLAIMED, PLAYER, COMPUTER } from './board';
import { AiPlayer } from './ai';


@Component({
  selector: 'my-app',
  template: `
    <h1>{{title}}</h1>
    <div class="row">
        <div class="col-md-4">
        <div *ngIf="board.winner == undefined">
            <h3>{{board.currentPlayerText}}'s Turn</h3>
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
    `
})
export class AppComponent {
    title = 'Connect 4';
    board = new Board;
    aiPlayer = new AiPlayer;

    restartGame() {
        this.board.restartGame();
    }
}
