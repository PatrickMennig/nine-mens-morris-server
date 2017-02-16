// ==== IMPORTS ====
const assert 						= require('assert');
const Game 							= require('../src/game/Game');

const Board 						= require('../src/game/gameObjects/Board');
const Player 						= require('../src/game/gameObjects/Player');
const Intersection 					= require('../src/game/gameObjects/Intersection');
const GAME_CONST					= require('../src/game/const');



// ==== TESTS ====
describe('Game', function () {

	describe('executeTurn', function () {
		
		it('should be a valid turn, phase 1 placing', function () {

			const g = new Game(0, GAME_CONST.PLAYER_HUMAN, 1, GAME_CONST.PLAYER_HUMAN);
			g.startGame();
			const p = g.players[g.activePlayer];

			const field = new Array(24).fill(null).map((v,i) => new Intersection(i));

			field[0].token = p.token;

			const result = g.executeTurn(p.id, {fromId: null, toId: 0, removeId: null});
			const expected = {
				status: GAME_CONST.GAME_ACTIVE,
				field: field,
				turn: {fromId: null, toId: 0, removeId: null}
			};

			assert.deepEqual(expected, result);
		});

		it('should be a valid turn, phase 2 moving', function () {

			const g = new Game(0, GAME_CONST.PLAYER_HUMAN, 1, GAME_CONST.PLAYER_HUMAN);
			g.startGame();
			const p = g.players[g.activePlayer];

			p.phase = GAME_CONST.GAME_PHASE_2;

			const field = new Array(24).fill(null).map((v,i) => new Intersection(i));

			field[0].token = p.token;

			g.board = new Board(field);

			const fieldExpected = new Array(24).fill(null).map((v,i) => new Intersection(i));

			fieldExpected[0].token = GAME_CONST.TOKEN_EMPTY;
			fieldExpected[1].token = p.token;

			const result = g.executeTurn(p.id, {fromId: 0, toId: 1, removeId: null});
			const expected = {
				status: GAME_CONST.GAME_ACTIVE,
				field: field,
				turn: {fromId: 0, toId: 1, removeId: null}
			};

			assert.deepEqual(expected, result);
		});

		it('should be a valid turn, phase 3 flying', function () {

			const g = new Game(0, GAME_CONST.PLAYER_HUMAN, 1, GAME_CONST.PLAYER_HUMAN);
			g.startGame();
			const p = g.players[g.activePlayer];

			p.phase = GAME_CONST.GAME_PHASE_3;

			const field = new Array(24).fill(null).map((v,i) => new Intersection(i));

			field[0].token = p.token;

			g.board = new Board(field);

			const fieldExpected = new Array(24).fill(null).map((v,i) => new Intersection(i));

			fieldExpected[0].token = GAME_CONST.TOKEN_EMPTY;
			fieldExpected[3].token = p.token;

			const result = g.executeTurn(p.id, {fromId: 0, toId: 3, removeId: null});
			const expected = {
				status: GAME_CONST.GAME_ACTIVE,
				field: field,
				turn: {fromId: 0, toId: 3, removeId: null}
			};

			assert.deepEqual(expected, result);
		});

		it('should be an invalid turn, phase 1 placing on occupied field', function () {

			const g = new Game(0, GAME_CONST.PLAYER_HUMAN, 1, GAME_CONST.PLAYER_HUMAN);
			g.startGame();
			const p = g.players[g.activePlayer];

			const field = new Array(24).fill(null).map((v,i) => new Intersection(i));

			field[0].token = p.token;

			g.board  = new Board(field);

			const result = g.executeTurn(p.id, {fromId: null, toId: 0, removeId: null});
			const expected = {
				status: GAME_CONST.GAME_ERROR
			};

			assert.deepEqual(expected, {state: result.state});
		});

		it('should be an invalid turn, phase 1 removing from mill', function () {

			const g = new Game(0, GAME_CONST.PLAYER_HUMAN, 1, GAME_CONST.PLAYER_HUMAN);
			g.startGame();
			const p = g.players[g.activePlayer];

			const field = new Array(24).fill(null).map((v,i) => new Intersection(i));

			const otherToken = p.token === GAME_CONST.TOKEN_PLAYER_ONE ? GAME_CONST.TOKEN_PLAYER_TWO : GAME_CONST.TOKEN_PLAYER_ONE;

			field[0].token = otherToken;
			field[1].token = otherToken;
			field[2].token = otherToken;
			field[3].token = p.token;

			g.board  = new Board(field);

			const result = g.executeTurn(p.id, {fromId: null, toId: 4, removeId: 1});
			const expected = {
				status: GAME_CONST.GAME_ERROR
			};

			assert.deepEqual(expected, {state: result.state});
		});
	});
	
});