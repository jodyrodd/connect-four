import { Board, UNCLAIMED, PLAYER, COMPUTER } from './board';

export class AiPlayer {
    maxDepth = 4;
    iterations = 0;
    evaulatedBoards = {};

    move(gameState: Board) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.iterations = 0;
                this.evaulatedBoards = {};
                let result = this.maxPlay(gameState);
                console.log("Iterations run = " + this.iterations);
                gameState.computerMove(result["move"]);
            }, 500);
        });
    }

    cellsPerCol(gameState: Board, col) {
        var count = 0;
        for(var row=0;row < 6;row++) {
            if(gameState.getOwner(row,col) != UNCLAIMED) count++;
        }
        return count;
    }

    concentrationMoves(gameState: Board) {
        var moves = gameState.availableMoves();
        var concentration = moves.map(col => this.cellsPerCol(gameState, col));
        var result = moves.filter(col =>
            (concentration[col] > 0) ||
            (col > 0 && concentration[col-1] > 0 ) ||
            (col < 6 && concentration[col+1]) > 0
        )
        return (result.length > 0 ? result : [3]);
    }

    maxPlay(gameState: Board, depth = this.maxDepth, alpha = undefined, beta = undefined): Object {
        let rtn = this.evaulatedBoards["MAX"+gameState.serializeBoard()];
        if(rtn !== undefined) {
            return rtn;
        }
        let availableMoves = this.concentrationMoves(gameState);

        let score = gameState.scoreBoard();

        if(depth === 0 || availableMoves.length === 0 || Math.abs(score) === gameState.maxScore) {
            return { move: null, score: score};
        }

        let maxMove = null;
        let maxScore = -9999;

        for(let move of availableMoves) {
            let newGameState = gameState.copy();
            newGameState.computerMove(move);

            this.iterations++;

            let evaluation = this.minPlay(newGameState, (depth-1), alpha, beta);

            if(maxMove === null || evaluation["score"] > maxScore) {
                maxMove = move;
                maxScore = evaluation["score"];
                alpha = maxScore;
            }

            if(alpha >= beta) {
                rtn = {move: maxMove, score: maxScore};
                this.evaulatedBoards["MAX"+gameState.serializeBoard()] = rtn;
                return rtn;
            }
        }
        rtn = {move: maxMove, score: maxScore};
        this.evaulatedBoards["MAX"+gameState.serializeBoard()] = rtn;
        return rtn;
    }

    minPlay(gameState: Board, depth, alpha, beta): Object {
        let rtn = this.evaulatedBoards["MIN"+gameState.serializeBoard()];
        if(rtn !== undefined) {
            return rtn;
        }
        let availableMoves = this.concentrationMoves(gameState);

        let score = gameState.scoreBoard();

        if(depth === 0 || availableMoves.length === 0 || Math.abs(score) === gameState.maxScore) {
            return { move: null, score: score};
        }

        let minMove = null;
        let minScore = 9999;

        for(let move of availableMoves) {
            let newGameState = gameState.copy();
            newGameState.playerMove(move);

            let evaluation = this.maxPlay(newGameState, (depth-1), alpha, beta);

            if(minMove === null || evaluation["score"] < minScore) {
                minMove = move;
                minScore = evaluation["score"];
                beta = minScore;
            }

            if(alpha >= beta) {
                rtn = {move: minMove, score: minScore};
                this.evaulatedBoards["MIN"+gameState.serializeBoard()] = rtn;
                return rtn;
            }
        }
        rtn = {move: minMove, score: minScore};
        this.evaulatedBoards["MIN"+gameState.serializeBoard()] = rtn;
        return rtn;
    }

}