const GAME_CONST = require('./const');

const TURN     = 'turn';
const GAME_ID  = 'gameId';
const GROUP_ID = 'groupId';
const PLAYER   = 'player';
const GAME_OFFERING_STATE   = 'gameOfferingState';

exports.TURN     = TURN;
exports.GAME_ID  = GAME_ID;
exports.GROUP_ID = GROUP_ID;
exports.GAME_OFFERING_STATE = GAME_OFFERING_STATE;


exports.isAcceptable        = function (target, val, store = null) {

    switch (target) {

        case TURN:
            return isWellFormedTurn(val);

        case GAME_ID:
            return isWellFormedGameId(val, store);

        case GROUP_ID:
            return isWellFormedGroupId(val);

        case GAME_OFFERING_STATE:
            return isGameInOfferingState(val);

        default:
            throw new Error(`Check for well formed ${target} not implemented.`);

    }
};


function isWellFormedTurn(turn) {
    return new Promise((resolve, reject) => {

        if (!isSet(turn['toId'])) {
            return reject(new Error(`Bad turn object. You have to at least supply a "toId".`));
        }

        if ([...Object.keys(turn).map(k => turn[k])].filter(idOutOfRange).length > 0) {
            return reject(new Error(`Bad turn object. One or more of your field ids is out of range.`));
        }

        resolve(turn);
    });
}


// TODO refractor out the store
function isWellFormedGameId(gameId, store) {
    return new Promise((resolve, reject) => {
        if (!isSet(store)) {
            throw new Error(`Store object is not passed`);
        }

        if (!store.isSet(gameId)) {
            return reject(new Error(`Bad GameId given, game does not exist.`));
        }
        resolve(gameId);
    });
}


function isWellFormedGroupId(groupId) {
    return new Promise((resolve, reject) => {
        if (!isSet(groupId)) {
            return reject(new Error(`Bad group id: ${groupId} given.`));
        }
        resolve(groupId);
    });
}


function isGameInOfferingState(game) {
    return new Promise((resolve, reject) => {
        if (game.state !== GAME_CONST.GAME_OFFERED) {
            return reject(new Error(`Game with id: ${game.id} is not in offering state.`));
        }
        resolve(game);
    });
}


function idOutOfRange(id) {
    return id < 0 || id > 23;
}


function isSet(val) {
    return val !== undefined && val !== null && val !== false && val !== '';
}