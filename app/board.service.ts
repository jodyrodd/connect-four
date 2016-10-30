import { Injectable } from '@angular/core';
import { Board } from './board';


@Injectable()
export class BoardService {

    constructor() {}

    newBoard(): Board {
        return new Board;
    }
}
