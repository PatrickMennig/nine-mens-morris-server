// ==== IMPORTS ====
const GAME_CONST = require('./../const');


class Player {

    constructor(id, type, token) {
        this.id              = id;
        this.type            = type;
        this.phase           = GAME_CONST.GAME_PHASE_1;
        this.token           = token;
        this.noTokensInHand  = 9;
        this.noTokensOnBoard = 0;
    }


    placedToken() {
        this.noTokensInHand--;
        this.noTokensOnBoard++;
    }

    lostToken() {
        this.noTokensOnBoard--;
    }


    static describe() {
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
    }

}

module.exports = Player;