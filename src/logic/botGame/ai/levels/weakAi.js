// ==== IMPORTS ====
const rules      = require('../../../../game/rules/rules');
const GAME_CONST = require('../../../../game/const');
const utility    = require('../utility');


// ==== PUBLIC FUNCTIONS ====
/**
 * Idea of simplest AI is to just make a valid random turn.
 * If we find a turn that will close a mill, then we will look for a token to remove.
 *
 * We just create random turns until one is valid by the rules
 * and execute this one, but try to close mills whenever we stumble upon one.
 *
 */
exports.makeTurn = (board, player, otherPlayer) => {

    const turn = randomTurn(player.phase);

    if (!rules.isValidTurn(board, player, turn.fromId, turn.toId)) {
        return exports.makeTurn(board, player, otherPlayer);
    }

    if (rules.willCloseMill(board, player, turn.fromId, turn.toId)) {

        for (let i = 0; i < 24; ++i) {
            if (rules.isValidRemoval(board, otherPlayer, turn.fromId, turn.toId, i)) {
                turn.removeId = i;
                return turn;
            }
        }

        return exports.makeTurn(board, player, otherPlayer);
    }

    return turn;
};


// ==== HELPER FUNCTIONS ====
function randomTurn(gamePhase) {
    switch (gamePhase) {
        case GAME_CONST.GAME_PHASE_1:
            return {
                fromId: null,
                toId: utility.getRandomInt(0, 23),
                removeId: null
            };

        case GAME_CONST.GAME_PHASE_2:
            return {
                fromId: utility.getRandomInt(0, 23),
                toId: utility.getRandomInt(0, 23),
                removeId: null
            };

        case GAME_CONST.GAME_PHASE_3:
            return {
                fromId: utility.getRandomInt(0, 23),
                toId: utility.getRandomInt(0, 23),
                removeId: null
            };
    }
}


