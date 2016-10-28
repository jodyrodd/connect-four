import { Board, UNCLAIMED, PLAYER, COMPUTER } from './board';

export class AiPlayer {
    maxDepth = 8;
    iterations = 0;

    getMove(gameState: Board) {
        this.iterations = 0;
        let result = this.maxPlay(gameState);
        console.log("Iterations run = " + this.iterations);
        return result["move"];
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
                return {move: maxMove, score: maxScore};
            }
        }
        return {move: maxMove, score: maxScore};
    }

    minPlay(gameState: Board, depth, alpha, beta): Object {
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
                return {move: minMove, score: minScore};
            }
        }
        return {move: minMove, score: minScore};
    }

}