// ==== IMPORTS ====
const rules      = require('../../../../game/rules/rules');
const GAME_CONST = require('../../../../game/const');
const utility    = require('../utility');



// ==== PUBLIC FUNCTIONS ====
/**
 * Idea of veryWeak AI is to just make a valid random turn.
 * Even if we find a mill, we will discard this turn if not also
 * has the correct removeId associated.
 * Most of the time, this bot will place and move randomly,
 * without ever removing a token.
 *
 * We just create random turns until one is valid by the rules
 * and execute this one.
 *
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
				toId: utility.getRandomInt(0,23),
				removeId: Math.random() > 0.75 ? utility.getRandomInt(0,23) : null
			};

		case GAME_CONST.GAME_PHASE_2:
			return {
				fromId: utility.getRandomInt(0,23),
				toId: utility.getRandomInt(0,23),
				removeId: Math.random() > 0.75 ? utility.getRandomInt(0,23) : null
			};

		case GAME_CONST.GAME_PHASE_3:
			return {
				fromId: utility.getRandomInt(0,23),
				toId: utility.getRandomInt(0,23),
				removeId: Math.random() > 0.75 ? utility.getRandomInt(0,23) : null
			};
	}
}