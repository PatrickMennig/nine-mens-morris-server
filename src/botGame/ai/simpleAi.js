// ==== IMPORTS ====
const rules 						= require('../../game/rules/rules');
const GAME_CONST					= require('../../game/const');



// ==== PUBLIC FUNCTIONS ====
/**
 * Idea of simplest AI is to just make a valid random turn.
 *
 * We just create random turns until one is valid by the rules
 * and execute this one
 *
 * @param board
 * @param player
 * @param otherPlayer
 */
exports.makeTurn = (board, player, otherPlayer) => {

	const turn = randomTurn(player.phase);

	if(!rules.isValidTurn(board, player, turn.fromId, turn.toId)) {
		return exports.makeTurn(board, player, otherPlayer);
	}

	if(rules.willCloseMill(board, player, turn.fromId, turn.toId) && turn.removeId === null){
		return exports.makeTurn(board, player, otherPlayer);
	}

	if(!rules.willCloseMill(board, player, turn.fromId, turn.toId) && turn.removeId !== null) {
		return exports.makeTurn(board, player, otherPlayer);
	}

	if(rules.willCloseMill(board, player, turn.fromId, turn.toId) && turn.removeId !== null && !rules.isValidRemoval(board, otherPlayer, turn.fromId, turn.toId, turn.removeId)) {
		return exports.makeTurn(board, player, otherPlayer);
	}

	return turn;
};



// ==== HELPER FUNCTIONS ====
function randomTurn(gamePhase) {
	switch (gamePhase) {
		case GAME_CONST.GAME_PHASE_1:
			return {
				fromId: null,
				toId: getRandomInt(0,23),
				removeId: Math.random() > 0.75 ? getRandomInt(0,23) : null
			};

		case GAME_CONST.GAME_PHASE_2:
			return {
				fromId: getRandomInt(0,23),
				toId: getRandomInt(0,23),
				removeId: Math.random() > 0.75 ? getRandomInt(0,23) : null
			};

		case GAME_CONST.GAME_PHASE_3:
			return {
				fromId: getRandomInt(0,23),
				toId: getRandomInt(0,23) ,
				removeId: Math.random() > 0.75 ? getRandomInt(0,23) : null
			};
	}
}

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
function getRandomArbitrary(min, max) {
	return Math.random() * (max - min) + min;
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}