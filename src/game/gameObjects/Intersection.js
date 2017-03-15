// ==== IMPORTS ====
const GAME_CONST = require('./../const');


// ==== CONSTRUCTOR ====
function Intersection(id) {
    this.id    = id;
    this.token = GAME_CONST.TOKEN_EMPTY;
}

module.exports = Intersection;


// ==== PUBLIC FUNCTIONS ====
Intersection.prototype.set = function (token) {

    if (this.token !== GAME_CONST.TOKEN_EMPTY && token !== GAME_CONST.TOKEN_EMPTY) {
        throw new Error(`You are trying to place a token on an non-empty spot.`);
    }
    if (this.token === GAME_CONST.TOKEN_EMPTY && token === GAME_CONST.TOKEN_EMPTY) {
        throw new Error(`INTERNAL ERROR: You are trying to free field: ${this.id} but no token is present here. (If you are seeing this in production, please report to your administrator.)`);
    }

    this.token = token;
};


Intersection.prototype.isEmpty = function () {
    return this.token === GAME_CONST.TOKEN_EMPTY;
};


Intersection.prototype.isOccupied = function () {
    return !this.isEmpty();
};


Intersection.prototype.equalsToken = function (token) {
    return this.token === token;
};


Intersection.prototype.notEqualsToken = function (token) {
    return !this.equalsToken(token);
};