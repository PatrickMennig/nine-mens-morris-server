// ==== IMPORTS ====
const GAME_CONST = require('./../const');


// ==== CONSTRUCTOR ====
function Player(id, type, token) {
    this.id              = id;
    this.type            = type;
    this.phase           = GAME_CONST.GAME_PHASE_1;
    this.token           = token;
    this.noTokensInHand  = 9;
    this.noTokensOnBoard = 0;
}

module.exports = Player;


// ==== STATIC FUNCTIONS / ATTRIBUTES ====
Player.describe = function () {
    return {
        name: 'player',
        desc: 'The player object describing the game\'s participants.',
        fields: [
            {
                name: 'id'
            },
            {
                name: 'type'
            },
            {
                name: 'phase'
            },
            {
                name: 'token'
            },
            {
                name: 'noTokensInHand'
            },
            {
                name: 'noTokensOnBoard'
            }
        ]
    }
};


// ==== PUBLIC FUNCTIONS ====
Player.prototype.placedToken = function () {
    this.noTokensInHand--;
    this.noTokensOnBoard++;
};

Player.prototype.lostToken = function () {
    this.noTokensOnBoard--;
};
