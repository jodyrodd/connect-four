import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Board } from './board';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class BoardService {

    private headers = new Headers({'Content-Type': 'application/json'});
    private boardUrl = 'http://localhost:4567/api/board';

    constructor(private http: Http) { }

    newBoard(): Promise<Board> {
        return this.http
            .post(this.boardUrl, {}, {})
            .toPromise()
            .then(res =>
                new Board(res.json()))
            .catch(this.handleError);
    }

    saveBoard(board: Board) {
        let url = this.boardUrl + "/" + board.uuid;
        let data = {
            "currentPlayer": board.currentPlayer,
            "rows": board.serializeBoard()
        };
        return this.http
            .put(url, JSON.stringify(data), {headers: this.headers})
            .toPromise()
            .catch(this.handleError);
    }

    loadBoard(id): Promise<Board> {
        let url = this.boardUrl + "/" + id;
        return this.http
            .get(url, {})
            .toPromise()
            .then(res =>
                new Board(res.json()))
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}
