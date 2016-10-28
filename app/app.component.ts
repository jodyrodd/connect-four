import { Component } from '@angular/core';
import { Board, UNCLAIMED, PLAYER, COMPUTER } from './board';
@Component({
  selector: 'my-app',
  template: `
    <h1>{{title}}</h1>
    <h3>{{board.currentPlayerText}}'s Turn</h3>
    <div *ngIf="board.winner">
    {{board.winner}} wins!
    </div>
    <div><button (click)="restartGame()">New Game</button>
    <game-board [board]="board"></game-board>
    `
})
export class AppComponent {
    title = 'Connect 4';
    board = new Board;

    restartGame() {
        this.board.restartGame();
    }
}
