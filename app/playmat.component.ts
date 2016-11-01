import { Component, OnInit  } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { BoardService } from './board.service';
import { Board, COMPUTER } from './board';
import { AiPlayer } from './ai';

@Component({
  selector: 'playmat',
  template: `
    <div class="row">
        <div class="col-md-4">
        <div *ngIf="board != undefined">
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
        </div>
        <div class="col-md-4">
            <div><button (click)="newGame()">New Game</button>
            <div>
                AI Difficulty (depth search):
                <input type="number" min="1" max="8" [(ngModel)]="aiPlayer.maxDepth" /><br/>
                <div *ngIf="board != undefined">
                    URL for this game:<br/>http://localhost:3000/games;id={{board.uuid}}
                </div>
            </div>
        </div>
    </div>
  `,
    providers: [BoardService]
})
export class PlaymatComponent {
    board: Board;
    aiPlayer = new AiPlayer;
    loadId: string;

    constructor(
        private boardService: BoardService,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            this.loadId = params['id'];
        });
        if(this.loadId !== undefined) {
            this.boardService.loadBoard(this.loadId).then(board =>
                this.board = board
            );
        } else {
            this.boardService.newBoard().then(board => {
                this.board = board;
                this.router.navigate(['/games', {id: this.board.uuid }]);
            });
        }
    }

    newGame() {
        this.boardService.newBoard().then(board => {
            this.board = board;
            this.router.navigate(['/games', {id: this.board.uuid }]);
        });
    }
}
