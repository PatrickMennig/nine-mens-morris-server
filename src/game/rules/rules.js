const GAME_CONST = require('./../const');
const fieldGraph = require('./fieldGraph');


exports.isValidTurn = function (board, player, fromId, toId) {

    // "to"-id has to be supplied
    if (toId == null) {
        return false;
    }

    // players are not allowed to place tokens on already occupied fields
    if (board.get(toId).isOccupied()) {
        return false;
    }

    switch (player.phase) {

        case GAME_CONST.GAME_PHASE_1:

            // no "from"-field is allowed
            if (fromId != null) {
                return false;
            }

            // players must have tokens left in their hand
            if (player.noTokensInHand <= 0) {
                return false;
            }

            break;

        case GAME_CONST.GAME_PHASE_2:

            // "from"-field has to be supplied
            if (fromId == null) {
                return false;
            }

            // players are not allowed to take tokens from empty fields
            if (board.get(fromId).isEmpty()) {
                return false;
            }

            // players may only move their own tokens
            if (board.get(fromId).notEqualsToken(player.token)) {
                return false;
            }

            // "from" and "to" need to be adjacent
            if (!fieldGraph.neighbors(fromId, toId)) {
                return false;
            }

            break;

        case GAME_CONST.GAME_PHASE_3:

            // "from"-field has to be supplied
            if (typeof fromId === 'undefined' || fromId === null) {
                return false;
            }

            // players are not allowed to take tokens from empty fields
            if (board.get([fromId]).isEmpty()) {
                return false;
            }

            // players may only move their own tokens
            if (board.get([fromId]).token !== player.token) {
                return false;
            }

            break;

        default:
            throw new Error(`Game phase supplied: ${player.phase} is not valid.`);
    }

    return true;
};


exports.willCloseMill = function (board, player, fromId, toId) {

    // look at all rows formed by the target
    const vRow = fieldGraph.getVerticalRow(toId);
    const hRow = fieldGraph.getHorizontalRow(toId);

    // look at all intersections in the row and check if they contain
    // tokens of one player
    const isMill = (row) => {
        // a mill is given when all elements in a row contain
        // tokens of one player
        return row.filter(r => {
                // we are looking at the future board state not yet
                // represented, hence check from and to separately
                // assume "from" to always be empty, player moves away from there
                if (r === fromId) {
                    return false;
                }
                // assume "to" to always contain a player token
                if (r === toId) {
                    return true;
                }
                // check if element in row contains player token
                return containsPlayerToken(board, r, player.token);
            }).length === 3;
    };

    const vMill = isMill(vRow);
    const hMill = isMill(hRow);

    return vMill || hMill || false;
};


exports.isValidRemoval = function (board, otherPlayer, fromId, toId, removeId) {

    if (typeof removeId === 'undefined' || removeId === null) {
        return true;
    }

    // player has exactly three tokens on the board and none in hand?
    // then every removal is valid as long as it does not remove empty or own token
    if (otherPlayer.noTokensInHand === 0
        && otherPlayer.noTokensOnBoard === 3
        && board.get([removeId]).token === otherPlayer.token) {
        return true;
    }

    // player wants to remove from empty field?
    if (board.get([removeId]).token !== otherPlayer.token) {
        return false;
    }

    // player has tokens in hand or more than three on the board
    // then removal is valid if target is not in mill
    return !exports.willCloseMill(board, otherPlayer, fromId, removeId);

};


exports.willEndGame = function (otherPlayer, removed = false) {
    return removed == true && otherPlayer.noTokensOnBoard === 3 && otherPlayer.noTokensInHand === 0;
};


exports.phaseForPlayer = function (player) {
    if (player.noTokensInHand > 0) {
        return GAME_CONST.GAME_PHASE_1;
    }
    if (player.noTokensOnBoard > 3) {
        return GAME_CONST.GAME_PHASE_2;
    }
    if (player.noTokensOnBoard === 3) {
        return GAME_CONST.GAME_PHASE_3;
    }
    throw new Error(`Invalid constellation, player should already have lost.`);
};


// ==== HELPER FUNCTIONS ====
function containsPlayerToken(board, fieldId, playerToken) {
    return board.get([fieldId]).token === playerToken;
}