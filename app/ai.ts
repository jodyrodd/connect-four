import { Board, UNCLAIMED, PLAYER, COMPUTER } from './board';

export class AiPlayer {
    maxDepth = 2;
    examinedStates: Object;

    getMove(gameState: Board) {
        this.examinedStates = {};
        var move = this.evaluateGameState(gameState);
        return move["move"];
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

    evaluateGameState(gameState: Board, player = COMPUTER, depth = this.maxDepth) {
        let rtn = this.examinedStates[gameState.serializeBoard()];
        if(rtn !== undefined) return rtn;
        var availableMoves = this.concentrationMoves(gameState);

        if(depth === 0 || availableMoves.length === 0) {
            return { move: null, score: 0 }
        }

        let bestMove, bestScore;
        let fn = player === COMPUTER ? Math.max : Math.min;

        for(let move of availableMoves) {
            let newGameState = gameState.copy();
            let row = newGameState.move(player,move);
            var score = 0;
            if(newGameState.winner !== undefined) {
                score = 1000*player;
            } else {
                var evaluatedState = this.evaluateGameState(newGameState, player*-1, (depth - 1));
                score = evaluatedState.score;
                newGameState.checkForWin(row, move, player, 3);
                if(newGameState.winner !== undefined) {
                    //this move gives 3 in a row, let's favor this move
                    score = fn(score, 750*player);
                }
            }
            if (bestScore === undefined ||
                bestScore !== fn(bestScore, score) ||
                (bestScore === score && Math.random() >= .8)) {
                bestScore = score;
                bestMove = move;
            }

        }
        let results = { move: bestMove, score: bestScore };
        this.examinedStates[gameState.serializeBoard()] = results;
        return results;
    }

}