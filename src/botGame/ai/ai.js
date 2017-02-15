// ==== IMPORTS ====
const simpleAi						= require('./simpleAi');



// ==== PUBLIC FUNCTIONS ====
exports.makeTurn = (board, player, otherPlayer) => {
	return simpleAi.makeTurn(board, player, otherPlayer);
};