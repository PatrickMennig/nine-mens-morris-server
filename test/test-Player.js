// ==== IMPORTS ====
const assert 						= require('assert');
const Player 						= require('../src/game/gameObjects/Player');
const GAME_CONST					= require('../src/game/const');



// ==== TESTS ====
describe('Player', function () {

	describe('placedToken', function () {

		it('should have eight tokens in hand', function () {
			const p = new Player(0, GAME_CONST.PLAYER_BOT, GAME_CONST.TOKEN_PLAYER_ONE);
			p.placedToken();
			assert.equal(8, p.noTokensInHand);
		});

		it('should have one token on the board', function () {
			const p = new Player(0, GAME_CONST.PLAYER_BOT, GAME_CONST.TOKEN_PLAYER_ONE);
			p.placedToken();
			assert.equal(1, p.noTokensOnBoard);
		});
	});

	describe('lostToken', function () {

		it('should have three tokens on the board', function () {
			const p = new Player(0, GAME_CONST.PLAYER_BOT, GAME_CONST.TOKEN_PLAYER_ONE);
			p.noTokensInHand = 3;
			p.noTokensOnBoard = 4;
			p.lostToken();
			assert.equal(3, p.noTokensOnBoard);
		});
	});
});