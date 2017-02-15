// ==== IMPORTS ====
const assert 						= require('assert');
const rules							= require('../src/game/rules/rules');

const Board 						= require('../src/game/gameObjects/Board');
const Player 						= require('../src/game/gameObjects/Player');
const Intersection 					= require('../src/game/gameObjects/Intersection');
const GAME_CONST					= require('../src/game/const');



// ==== TESTS ====
describe('rules', function () {



	describe('isValidTurn', function () {

		it('should return false, no fromId', function () {

			const p = new Player(0, GAME_CONST.PLAYER_BOT, GAME_CONST.TOKEN_PLAYER_ONE);
			const b = new Board();

			assert.equal(false, rules.isValidTurn(b, p));
		});

		it('should return false, target field occupied', function () {

			const p = new Player(0, GAME_CONST.PLAYER_BOT, GAME_CONST.TOKEN_PLAYER_ONE);
			const field = new Array(24).fill(null).map((v,i) => new Intersection(i));

			field[0].token = p.token;
			field[1].token = p.token;

			const b = new Board(field);

			assert.equal(false, rules.isValidTurn(b, p, 0, 1));
		});

		it('should return false, phase 1 and from field', function () {

			const p = new Player(0, GAME_CONST.PLAYER_BOT, GAME_CONST.TOKEN_PLAYER_ONE);
			const field = new Array(24).fill(null).map((v,i) => new Intersection(i));

			field[0].token = p.token;

			const b = new Board(field);

			assert.equal(false, rules.isValidTurn(b, p, 0, 2));
		});

		it('should return false, phase 1 and hand is empty', function () {

			const p = new Player(0, GAME_CONST.PLAYER_BOT, GAME_CONST.TOKEN_PLAYER_ONE);

			p.noTokensInHand = 0;
			p.noTokensOnBoard = 6;

			const field = new Array(24).fill(null).map((v,i) => new Intersection(i));

			field[0].token = p.token;
			field[1].token = p.token;
			field[2].token = p.token;
			field[3].token = p.token;
			field[4].token = p.token;
			field[5].token = p.token;

			const b = new Board(field);

			assert.equal(false, rules.isValidTurn(b, p, null, 6));
		});

		it('should return false, phase 2 and no from field', function () {

			const p = new Player(0, GAME_CONST.PLAYER_BOT, GAME_CONST.TOKEN_PLAYER_ONE);

			p.phase = GAME_CONST.GAME_PHASE_2;

			const b = new Board();

			assert.equal(false, rules.isValidTurn(b, p, null, 0));
		});

		it('should return false, phase 2 and from field is empty', function () {

			const p = new Player(0, GAME_CONST.PLAYER_BOT, GAME_CONST.TOKEN_PLAYER_ONE);

			p.phase = GAME_CONST.GAME_PHASE_2;

			const field = new Array(24).fill(null).map((v,i) => new Intersection(i));

			const b = new Board(field);

			assert.equal(false, rules.isValidTurn(b, p, 0, 1));
		});

		it('should return false, phase 2 and from field is enemy token', function () {

			const p = new Player(0, GAME_CONST.PLAYER_BOT, GAME_CONST.TOKEN_PLAYER_ONE);

			p.phase = GAME_CONST.GAME_PHASE_2;

			const field = new Array(24).fill(null).map((v,i) => new Intersection(i));

			field[0].token = GAME_CONST.TOKEN_PLAYER_TWO;

			const b = new Board(field);

			assert.equal(false, rules.isValidTurn(b, p, 0, 1));
		});

		it('should return false, phase 2 and from field is not adjacent to target field', function () {

			const p = new Player(0, GAME_CONST.PLAYER_BOT, GAME_CONST.TOKEN_PLAYER_ONE);

			p.phase = GAME_CONST.GAME_PHASE_2;

			const field = new Array(24).fill(null).map((v,i) => new Intersection(i));

			field[0].token = p.token;

			const b = new Board(field);

			assert.equal(false, rules.isValidTurn(b, p, 0, 2));
		});

		it('should return false, phase 3 and no from field', function () {

			const p = new Player(0, GAME_CONST.PLAYER_BOT, GAME_CONST.TOKEN_PLAYER_ONE);

			p.phase = GAME_CONST.GAME_PHASE_3;

			const b = new Board();

			assert.equal(false, rules.isValidTurn(b, p, null, 1));
		});

		it('should return false, phase 3 and from field is empty', function () {

			const p = new Player(0, GAME_CONST.PLAYER_BOT, GAME_CONST.TOKEN_PLAYER_ONE);
			const b = new Board();

			assert.equal(false, rules.isValidTurn(b, p, 0, 1));
		});

		it('should return false, phase 3 and from field is enemy token', function () {

			const p = new Player(0, GAME_CONST.PLAYER_BOT, GAME_CONST.TOKEN_PLAYER_ONE);
			const field = new Array(24).fill(null).map((v,i) => new Intersection(i));

			field[0].token = GAME_CONST.TOKEN_PLAYER_TWO;

			const b = new Board(field);

			assert.equal(false, rules.isValidTurn(b, p, 0, 1));
		});

		it('should return true, valid phase 1 turn', function () {

			const p = new Player(0, GAME_CONST.PLAYER_BOT, GAME_CONST.TOKEN_PLAYER_ONE);
			const b = new Board();

			assert.equal(true, rules.isValidTurn(b, p, null, 15));
		});

		it('should return true, valid phase 2 turn', function () {

			const p = new Player(0, GAME_CONST.PLAYER_BOT, GAME_CONST.TOKEN_PLAYER_ONE);

			p.phase = GAME_CONST.GAME_PHASE_2;
			p.noTokensInHand = 0;
			p.noTokensOnBoard = 5;

			const field = new Array(24).fill(null).map((v,i) => new Intersection(i));

			field[0].token = p.token;
			field[1].token = GAME_CONST.TOKEN_PLAYER_TWO;
			field[2].token = p.token;
			field[21].token = p.token;
			field[9].token = p.token;
			field[22].token = p.token;

			const b = new Board(field);

			assert.equal(true, rules.isValidTurn(b, p, 22, 19));
		});

		it('should return true, valid phase 3 turn', function () {

			const p = new Player(0, GAME_CONST.PLAYER_BOT, GAME_CONST.TOKEN_PLAYER_ONE);

			p.phase = GAME_CONST.GAME_PHASE_3;
			p.noTokensInHand = 0;
			p.noTokensOnBoard = 3;
			const field = new Array(24).fill(null).map((v,i) => new Intersection(i));

			field[9].token = p.token;
			field[21].token = p.token;
			field[22].token = p.token;

			const b = new Board(field);

			assert.equal(true, rules.isValidTurn(b, p, 9, 23));
		});

	});



	describe('willCloseMill', function () {

		it('should return true, player closes vertical mill', function () {

			const p = new Player(0, GAME_CONST.PLAYER_BOT, GAME_CONST.TOKEN_PLAYER_ONE);
			const field = new Array(24).fill(null).map((v,i) => new Intersection(i));

			field[0].token = p.token;
			field[2].token = p.token;
			field[3].token = p.token;
			field[4].token = p.token;
			field[10].token = p.token;
			field[14].token = p.token;
			field[18].token = p.token;
			field[21].token = p.token;
			field[23].token = p.token;

			const b = new Board(field);

			assert.equal(true, rules.willCloseMill(b, p, 10, 9));
		});

		it('should return true, player closes horizontal mill', function () {

			const p = new Player(0, GAME_CONST.PLAYER_BOT, GAME_CONST.TOKEN_PLAYER_ONE);
			const field = new Array(24).fill(null).map((v,i) => new Intersection(i));

			field[0].token = p.token;
			field[2].token = p.token;
			field[3].token = p.token;
			field[4].token = p.token;
			field[10].token = p.token;
			field[14].token = p.token;
			field[18].token = p.token;
			field[21].token = p.token;
			field[23].token = p.token;

			const b = new Board(field);

			assert.equal(true, rules.willCloseMill(b, p, 4, 1));
		});

		it('should return true, player closes horizontal and vertical mill', function () {

			const p = new Player(0, GAME_CONST.PLAYER_BOT, GAME_CONST.TOKEN_PLAYER_ONE);
			const field = new Array(24).fill(null).map((v,i) => new Intersection(i));

			field[0].token = p.token;
			field[1].token = p.token;
			field[14].token = p.token;
			field[23].token = p.token;
			field[5].token = GAME_CONST.TOKEN_PLAYER_TWO;

			const b = new Board(field);

			assert.equal(true, rules.willCloseMill(b, p, null, 2));
		});

		it('should return false, player doesn\'t close a vertical mill', function () {

			const p = new Player(0, GAME_CONST.PLAYER_BOT, GAME_CONST.TOKEN_PLAYER_ONE);
			const field = new Array(24).fill(null).map((v,i) => new Intersection(i));

			field[0].token = p.token;
			field[2].token = GAME_CONST.TOKEN_PLAYER_TWO;
			field[3].token = p.token;
			field[4].token = p.token;
			field[10].token = p.token;
			field[14].token = p.token;
			field[18].token = p.token;
			field[21].token = GAME_CONST.TOKEN_PLAYER_TWO;
			field[23].token = p.token;

			const b = new Board(field);

			assert.equal(false, rules.willCloseMill(b, p, 10, 9));
		});

		it('should return false, player doesn\'t close a horizontal mill', function () {

			const p = new Player(0, GAME_CONST.PLAYER_BOT, GAME_CONST.TOKEN_PLAYER_ONE);
			const field = new Array(24).fill(null).map((v,i) => new Intersection(i));

			field[0].token = p.token;
			field[2].token = GAME_CONST.TOKEN_PLAYER_TWO;
			field[3].token = p.token;
			field[4].token = p.token;
			field[10].token = p.token;
			field[14].token = p.token;
			field[18].token = p.token;
			field[21].token = GAME_CONST.TOKEN_PLAYER_TWO;
			field[23].token = p.token;

			const b = new Board(field);

			assert.equal(false, rules.willCloseMill(b, p, 4, 1));
		});

		it('should return false, player doesn\'t close a mill', function () {

			const p = new Player(0, GAME_CONST.PLAYER_BOT, GAME_CONST.TOKEN_PLAYER_ONE);
			const field = new Array(24).fill(null).map((v,i) => new Intersection(i));

			field[0].token = GAME_CONST.TOKEN_PLAYER_TWO;
			field[2].token = GAME_CONST.TOKEN_PLAYER_TWO;
			field[4].token = GAME_CONST.TOKEN_PLAYER_TWO;
			field[5].token = GAME_CONST.TOKEN_PLAYER_TWO;
			field[8].token = GAME_CONST.TOKEN_PLAYER_TWO;
			field[10].token = GAME_CONST.TOKEN_PLAYER_TWO;
			field[11].token = GAME_CONST.TOKEN_PLAYER_TWO;
			field[13].token = p.token;
			field[14].token = p.token;
			field[16].token = p.token;
			field[19].token = p.token;
			field[20].token = p.token;
			field[23].token = p.token;

			const b = new Board(field);

			assert.equal(false, rules.willCloseMill(b, p, null, 9));
		});


	});



	describe('isValidRemoval', function () {

		it('should return true, remove token that is not in mill, other player in phase 1', function () {

			const p = new Player(0, GAME_CONST.PLAYER_BOT, GAME_CONST.TOKEN_PLAYER_ONE);

			p.noTokensInHand = 3;
			p.noTokensOnBoard = 4;

			const field = new Array(24).fill(null).map((v,i) => new Intersection(i));

			field[0].token = p.token;
			field[2].token = p.token;
			field[3].token = p.token;
			field[4].token = p.token;
			field[13].token = GAME_CONST.TOKEN_PLAYER_TWO;

			const b = new Board(field);

			assert.equal(true, rules.isValidRemoval(b, p, 13, 5, 2));
		});

		it('should return true, remove token that is not in mill, other player in phase 2', function () {

			const p = new Player(0, GAME_CONST.PLAYER_BOT, GAME_CONST.TOKEN_PLAYER_ONE);

			p.noTokensInHand = 0;
			p.noTokensOnBoard = 4;

			const field = new Array(24).fill(null).map((v,i) => new Intersection(i));

			field[0].token = p.token;
			field[2].token = p.token;
			field[3].token = p.token;
			field[4].token = p.token;
			field[13].token = GAME_CONST.TOKEN_PLAYER_TWO;

			const b = new Board(field);

			assert.equal(true, rules.isValidRemoval(b, p, 13, 5, 2));
		});

		it('should return true, remove token that is not in mill, other player in phase 3', function () {

			const p = new Player(0, GAME_CONST.PLAYER_BOT, GAME_CONST.TOKEN_PLAYER_ONE);

			p.noTokensInHand = 0;
			p.noTokensOnBoard = 3;

			const field = new Array(24).fill(null).map((v,i) => new Intersection(i));

			field[0].token = p.token;
			field[2].token = p.token;
			field[3].token = p.token;
			field[4].token = GAME_CONST.TOKEN_PLAYER_TWO;

			const b = new Board(field);

			assert.equal(true, rules.isValidRemoval(b, p, 4, 1, 2));
		});


		it('should return false, remove token that is in mill, other player in phase 1', function () {

			const p = new Player(0, GAME_CONST.PLAYER_BOT, GAME_CONST.TOKEN_PLAYER_ONE);

			p.noTokensInHand = 3;
			p.noTokensOnBoard = 4;

			const field = new Array(24).fill(null).map((v,i) => new Intersection(i));

			field[0].token = p.token;
			field[2].token = p.token;
			field[14].token = p.token;
			field[23].token = p.token;
			field[13].token = GAME_CONST.TOKEN_PLAYER_TWO;

			const b = new Board(field);

			assert.equal(false, rules.isValidRemoval(b, p, 13, 5, 2));
		});

		it('should return false, remove token that is in mill, other player in phase 2', function () {

			const p = new Player(0, GAME_CONST.PLAYER_BOT, GAME_CONST.TOKEN_PLAYER_ONE);

			p.noTokensInHand = 0;
			p.noTokensOnBoard = 4;

			const field = new Array(24).fill(null).map((v,i) => new Intersection(i));

			field[0].token = p.token;
			field[1].token = p.token;
			field[2].token = p.token;
			field[3].token = p.token;
			field[13].token = GAME_CONST.TOKEN_PLAYER_TWO;

			const b = new Board(field);

			assert.equal(false, rules.isValidRemoval(b, p, 13, 5, 2));
		});

		it('should return true, remove token that is in mill, but other player in phase 3', function () {

			const p = new Player(0, GAME_CONST.PLAYER_BOT, GAME_CONST.TOKEN_PLAYER_ONE);

			p.noTokensInHand = 0;
			p.noTokensOnBoard = 3;

			const field = new Array(24).fill(null).map((v,i) => new Intersection(i));

			field[18].token = p.token;
			field[19].token = p.token;
			field[20].token = p.token;
			field[4].token = GAME_CONST.TOKEN_PLAYER_TWO;

			const b = new Board(field);

			assert.equal(true, rules.isValidRemoval(b, p, 4, 1, 19));
		});

		it('should return false, remove token from empty intersection', function () {

			const p = new Player(0, GAME_CONST.PLAYER_BOT, GAME_CONST.TOKEN_PLAYER_ONE);

			p.noTokensInHand = 3;
			p.noTokensOnBoard = 3;

			const field = new Array(24).fill(null).map((v,i) => new Intersection(i));

			field[0].token = p.token;
			field[1].token = p.token;
			field[2].token = p.token;
			field[3].token = GAME_CONST.TOKEN_PLAYER_TWO;

			const b = new Board(field);

			assert.equal(false, rules.isValidRemoval(b, p, null, 4, 7));
		});


	});



	describe('willEndGame', function () {

		it('should return false if player will not lose game, has only three tokens but none removed', function () {

			const p = new Player(0, GAME_CONST.PLAYER_BOT, GAME_CONST.TOKEN_PLAYER_ONE);

			p.noTokensOnBoard = 3;
			p.noTokensInHand = 0;

			assert.equal(false, rules.willEndGame(p, false));
		});

		it('should return true if player will lose game, has only three tokens on board', function () {

			const p = new Player(0, GAME_CONST.PLAYER_BOT, GAME_CONST.TOKEN_PLAYER_ONE);

			p.noTokensOnBoard = 3;
			p.noTokensInHand = 0;

			assert.equal(true, rules.willEndGame(p, true));
		});

		it('should return false if player will not lose game, has three tokens on board but still some in hand', function () {

			const p = new Player(0, GAME_CONST.PLAYER_BOT, GAME_CONST.TOKEN_PLAYER_ONE);

			p.noTokensOnBoard = 3;
			p.noTokensInHand = 1;

			assert.equal(false, rules.willEndGame(p, true));
		});

		it('should return false if player will not lose game, has more than three tokens on board', function () {

			const p = new Player(0, GAME_CONST.PLAYER_BOT, GAME_CONST.TOKEN_PLAYER_ONE);

			p.noTokensOnBoard = 4;
			p.noTokensInHand = 0;

			assert.equal(false, rules.willEndGame(p, true));
		});
	});



	describe('phaseForPlayer', function () {

		it('should be phase 1 as tokens still in hand', function () {

			const p = new Player(0, GAME_CONST.PLAYER_BOT, GAME_CONST.TOKEN_PLAYER_ONE);

			p.noTokensOnBoard = 3;
			p.noTokensInHand = 1;

			assert.equal(GAME_CONST.GAME_PHASE_1, rules.phaseForPlayer(p));
		});

		it('should be phase 2 as no tokens in hand and more than 3 on board', function () {

			const p = new Player(0, GAME_CONST.PLAYER_BOT, GAME_CONST.TOKEN_PLAYER_ONE);

			p.noTokensOnBoard = 6;
			p.noTokensInHand = 0;

			assert.equal(GAME_CONST.GAME_PHASE_2, rules.phaseForPlayer(p));
		});

		it('should be phase 3 as no tokens in hand and only 3 on board', function () {

			const p = new Player(0, GAME_CONST.PLAYER_BOT, GAME_CONST.TOKEN_PLAYER_ONE);

			p.noTokensOnBoard = 3;
			p.noTokensInHand = 0;

			assert.equal(GAME_CONST.GAME_PHASE_3, rules.phaseForPlayer(p));
		});
	});

});
