// ==== IMPORTS ====
const Intersection = require('./Intersection');


// ==== CONSTRUCTOR ====
function Board(board = emptyBoard()) {
    this.field = board;
}

module.exports = Board;


// ==== PUBLIC FUNCTIONS ====
Board.prototype.set = function (fieldId, token) {
    this.field[fieldId].set(token);
};


Board.prototype.get = function (fieldId) {
    return this.field[fieldId];
};


Board.prototype.visual = function () {
    return `
	
	    ${this.field[0].token} - - - - - - ${this.field[1].token} - - - - - - ${this.field[2].token}
		|             |             |
		|     ${this.field[3].token} - - - ${this.field[4].token} - - - ${this.field[5].token}     |
		|     |       |       |     |
		|     |   ${this.field[6].token} - ${this.field[7].token} - ${this.field[8].token}   |     |
		|     |   |       |   |     |
		${this.field[9].token} - - ${this.field[10].token} - ${this.field[11].token}       ${this.field[12].token} - ${this.field[13].token} - - ${this.field[14].token}
		|     |   |       |   |     |
		|     |   ${this.field[15].token} - ${this.field[16].token} - ${this.field[17].token}   |     |
		|     |       |       |     |
		|     ${this.field[18].token} - - - ${this.field[19].token} - - - ${this.field[20].token}     |
		|             |             |
		${this.field[21].token} - - - - - - ${this.field[22].token} - - - - - - ${this.field[23].token}
	
	`;
};


Board.prototype.fieldIds = function () {
    return `
		Ids of board intersections
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
};


// ==== HELPER FUNCTIONS ====
function emptyBoard() {
    return new Array(24).fill(null).map((v, id) => new Intersection(id));
}