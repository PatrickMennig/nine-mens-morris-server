// ==== IMPORTS ====
const Intersection = require('./Intersection');


class Board {

    constructor(board = Board.emptyField()) {
        this.board = board;
    }


    set(fieldId, token) {
        this.board[fieldId].set(token);
    }

    get(fieldId) {
        return this.board[fieldId];
    }

    getFullBoard() {
        return this.board;
    }

    fieldIds() {
        return `
            Ids of board intersections:
            
            0 - - - - - - 1 - - - - - - 2
            |             |             |
            |     3 - - - 4 - - - -5    |
            |     |       |        |    |
            |     |   6 - 7 - 8    |    |
            |     |   |       |    |    |
            12- -13- -14      12- -13- -14
            |     |   |       |    |    |
            |     |   15- 16- 17   |    |
            |     |       |        |    |
            |     18- - - 19- - - -20   |
            |             |             |
            21- - - - - - 22- - - - - - 23
	    `;
    }

    visual() {
        return `
            ${this.board[0].token} - - - - - - ${this.board[1].token} - - - - - - ${this.board[2].token}
            |             |             |
            |     ${this.board[3].token} - - - ${this.board[4].token} - - - ${this.board[5].token}     |
            |     |       |       |     |
            |     |   ${this.board[6].token} - ${this.board[7].token} - ${this.board[8].token}   |     |
            |     |   |       |   |     |
            ${this.board[9].token} - - ${this.board[10].token} - ${this.board[11].token}       ${this.board[12].token} - ${this.board[13].token} - - ${this.board[14].token}
            |     |   |       |   |     |
            |     |   ${this.board[15].token} - ${this.board[16].token} - ${this.board[17].token}   |     |
            |     |       |       |     |
            |     ${this.board[18].token} - - - ${this.board[19].token} - - - ${this.board[20].token}     |
            |             |             |
            ${this.board[21].token} - - - - - - ${this.board[22].token} - - - - - - ${this.board[23].token}
	    `;
    }


    static emptyField() {
        return new Array(24).fill(null).map((v, id) => new Intersection(id));
    }

}

module.exports = Board;