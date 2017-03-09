// ==== IMPORTS ====
const veryWeakAi						= require('./levels/veryWeakAi');
const weakAi							= require('./levels/weakAi');



// ==== PUBLIC FUNCTIONS ====
exports.makeTurn = (board, player, otherPlayer) => {
	// return veryWeakAi.makeTurn(board, player, otherPlayer);
	return weakAi.makeTurn(board, player, otherPlayer);
};