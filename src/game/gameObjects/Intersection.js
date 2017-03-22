// ==== IMPORTS ====
const GAME_CONST = require('./../const');


class Intersection {

    constructor(id) {
        this.id    = id;
        this.token = GAME_CONST.TOKEN_EMPTY;
    }


    isEmpty() {
        return this.token === GAME_CONST.TOKEN_EMPTY;
    }

    isOccupied() {
        return !this.isEmpty();
    }

    equalsToken(token) {
        return this.token === token;
    }

    notEqualsToken(token) {
        return !this.equalsToken(token)
    }

    set(token) {
        if (this.token !== GAME_CONST.TOKEN_EMPTY && token !== GAME_CONST.TOKEN_EMPTY) {
            throw new Error(`You are trying to place a token on an non-empty spot.`);
        }
        if (this.token === GAME_CONST.TOKEN_EMPTY && token === GAME_CONST.TOKEN_EMPTY) {
            throw new Error(`INTERNAL ERROR: You are trying to free field: ${this.id} but no token is present here. (If you are seeing this in production, please report to your administrator.)`);
        }

        this.token = token;
    }
}

module.exports = Intersection;