// ==== IMPORTS ====


//TODO use this in botgame too


// ==== CONSTRUCTOR ====
function GameResponse(statusCode, msg, game) {
}

module.exports = GameResponse;


// === PUBLIC FUNCTIONS ===


// ==== STATIC FUNCTIONS ====
GameResponse.res = function (statusCode, game, turnResult) {
    return {
        statusCode: statusCode,
        id: game.id,
        activePlayer: game.activePlayer,
        creationTime: game.creationTime,
        turnResult: turnResult
    };
};


GameResponse.STATUS = {
    NEXT_TURN: 100,
    VICTORY: 200,
    VICTORY_INVALID_TURN: 201,
    VICTORY_TIMEOUT: 202,
    LOSS: 300,
    LOSS_INVALID_TURN: 301
};


// ==== HELPER FUNCTIONS ====
