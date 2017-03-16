// ==== IMPORTS ====
const Board 						= require('./gameObjects/Board');
const Player 						= require('./gameObjects/Player');
const Turn 							= require('./gameObjects/Turn');

const rules 						= require('./rules/rules');
const GAME_CONST 					= require('./const');

const base32						= require('base32');



// ==== LOCAL CONSTANTS ====
const ID_MIN_INT = 10000;									// also determines the min-length of the ids
const MAX_CONCURRENT_GAMES = 10000;
const ID_MAX_INT = ID_MIN_INT + MAX_CONCURRENT_GAMES;		// also determines the max-length of ids



// ==== CONSTRUCTOR ====
function Game (pOneId=null, pOneType=null, pTwoId=null, pTwoType=null) {

	this.id = gameId();
	this.creationTime = new Date().getTime();
	this.lastTurnPlayedAt = new Date().getTime();

	this.state = GAME_CONST.GAME_OFFERED;

	this.board = new Board();

	this.activePlayer = randomPlayer();
	this.players = [];

	if(pOneId !== null && pOneType !== null) {
		this.addPlayer(pOneId, pOneType);
	}
	if(pTwoId !== null && pTwoType !== null) {
		this.addPlayer(pTwoId, pTwoType);
	}
}

module.exports = Game;



// ==== PUBLIC FUNCTIONS ====
Game.prototype.boardState = function () {
	return this.board.field;
};

Game.prototype.boardStateVisual = function () {
	return this.board.visual();
};


Game.prototype.isAllPlayersJoined = function () {
	return this.players.length === 2;
};

Game.prototype.numberOfPlayers = function () {
	return this.players.length;
};

Game.prototype.addPlayer = function (pId, pType) {
	if(this.isAllPlayersJoined()) { return false; }
	this.players.push(new Player(pId, pType, nextToken(this.players)));
	return true;
};

Game.prototype.getActivePlayer = function () {
	return this.players[this.activePlayer];
};

Game.prototype.getOtherPlayer = function () {
	return this.players[otherPlayer(this.activePlayer)];
};

Game.prototype.getPlayerById = function (playerId) {
	return this.players.find(p => p.id == playerId);
};


Game.prototype.isBotActive = function () {
	return this.getActivePlayer().id === GAME_CONST.PLAYER_BOT;
};

Game.prototype.executeBotTurn = function (ai) {
	return this.executeTurn(GAME_CONST.PLAYER_BOT, ai.makeTurn(this.board, this.getActivePlayer(), this.getOtherPlayer()));
};

Game.prototype.emptyTurnResult = function () {
	return {
		state: this.state,
		field: this.board.field,
		turn: {}
	};
};


Game.prototype.setTimeoutState = function () {
	this.state = GAME_CONST.GAME_TIMED_OUT;
};

Game.prototype.setToDeleteState = function () {
	this.state = GAME_CONST.GAME_TO_DELETE;
};

Game.prototype.setErrorState = function () {
	this.state = GAME_CONST.GAME_ERROR;
};

Game.prototype.endWithError = function (err) {
	this.setErrorState();
	return {
		state: this.state,
		error: err
	}
};

Game.prototype.startGame = function () {
	this.state = GAME_CONST.GAME_ACTIVE;
};


/**
 *
 * The Game class should contain all the logic necessary to play.
 * You create it with the two players.
 *
 * Later you supply the turn each player makes.
 * It should be in the clients responsibility to make correct turns.
 * However, the game will check the turn against the rules and decline it if necessary.
 *
 * @param playerId : the player's id
 * @param turn : { fromId: Int(0...23) | null, toId: Int(0...23), removeId: Int(0...23) | null }
 */
Game.prototype.executeTurn = function (playerId, turn) {

	//TODO there is an error in the checks, when supplying {"toId":x} as a turn object it crashes

	// step 1: do all the checks
	if(this.state !== GAME_CONST.GAME_ACTIVE) {
		throw new Error(`You are trying to take a turn in a game in status: ${this.state} but only status: ${GAME_CONST.GAME_ACTIVE} can be played.`)
	}

	if(!isValidPlayerId(this.players, playerId)) {
		throw new Error(`Player with id: ${playerId} is not part of this match.`);
	}

	if(!isPlayersTurn(this.players, this.activePlayer, playerId)) {
		return  this.endWithError( new Error(`Player with id: ${playerId} is not the active player. It's not your turn.`) );
	}

	const activePlayerObj = this.players.find(p => p.id === playerId);
	const otherPlayerObj = this.players[otherPlayer(this.activePlayer)];
    let {fromId = null, toId = null, removeId = null} = turn;

    if (fromId != null && fromId < 0) {
        fromId = null;
    }

    if (removeId != null && removeId < 0) {
        removeId = null;
    }

	if(!rules.isValidTurn(this.board, activePlayerObj, fromId, toId)) {
		return  this.endWithError( new Error(`Invalid turn. This move is not allowed by the rules.`) );
	}

	const willClose = rules.willCloseMill(this.board, activePlayerObj, fromId, toId);
	if(willClose && removeId == null) {
        return this.endWithError(new Error(`You are closing a mill this turn but didn't supply a field id where you want to remove a token.`));
	}

    if (!willClose && removeId != null) {
        return this.endWithError(new Error(`You are not closing a mill this turn but sending a field id where you want to remove a token.`));
    }

	if(!rules.isValidRemoval(this.board, otherPlayerObj, fromId, toId, removeId)) {
		return  this.endWithError( new Error(`You closed a mill but the token you want to remove: ${removeId} is not allowed to be removed by the rules.`) );
	}


	this.lastTurnPlayedAt = new Date().getTime();


	// step 2: check the consequences (i. e. will game end?)
	// if yes, we do not execute the last turn
    if (rules.willEndGame(otherPlayerObj, removeId != null)) {
		this.state = GAME_CONST.GAME_FINISHED;
		return {
			state: this.state,
			winner: activePlayerObj.id,
			turn: turn
		}
	}


	// step 3: actually execute the turn
	if(fromId != null) {
		this.board.set(fromId, GAME_CONST.TOKEN_EMPTY);
	}

	this.board.set(toId, activePlayerObj.token);

	if(fromId == null) {
		activePlayerObj.placedToken();
	}

	if(removeId != null) {
		this.board.set(removeId, GAME_CONST.TOKEN_EMPTY);
		otherPlayerObj.lostToken();
	}

	activePlayerObj.phase = rules.phaseForPlayer(activePlayerObj);
	otherPlayerObj.phase = rules.phaseForPlayer(otherPlayerObj);

	this.activePlayer = otherPlayer(this.activePlayer);

	return {
		state: this.state,
		field: this.board.field,
		turn: turn
	};
};



// ==== STATIC FUNCTIONS / ATTRIBUTES ====
Game.PLAYER_HUMAN = GAME_CONST.PLAYER_HUMAN;
Game.PLAYER_BOT = GAME_CONST.PLAYER_BOT;
Game.NO_ID = GAME_CONST.NO_ID;

Game.describe = function () {
	return {
		name: 'game',
		desc: 'The game object returned when querying active games.',
		fields: [
			{
				name: 'id',
				desc: 'Unique id for the game, send this with every request to the server when playing.'
			},
			{
				name: 'creationTime',
				desc: 'Timestamp of game creation.'
			},
			{
				name: 'lastTurnPlayedAt',
				desc: 'Timestamp of the last turn made.'
			},
			{
				name: 'status',
				desc: 'The state of the game.',
				values: [ GAME_CONST.GAME_ACTIVE, GAME_CONST.GAME_ERROR, GAME_CONST.GAME_FINISHED, GAME_CONST.GAME_TIMED_OUT, GAME_CONST.GAME_TO_DELETE ]
			},
			{
				name: 'activePlayer',
				desc: 'Indicates who is the current active player, essential for the first turn.',
				values: [
					{
						value: GAME_CONST.PLAYER_ONE_TURN,
						type: GAME_CONST.PLAYER_ONE_TURN_READABLE
					},
					{
						value: GAME_CONST.PLAYER_TWO_TURN,
						type: GAME_CONST.PLAYER_TWO_TURN_READABLE
					}
				]
			},
			{
				name: 'players',
				desc: 'The two players that are playing this game. Shows their object representation.'
			},
			{
				name: 'field',
				desc: 'Represents the intersections of the board. Numbering is from lower left corner to the right and up.',
				visual: new Board().fieldIds(),
				values: [
					{
						value: GAME_CONST.TOKEN_PLAYER_ONE,
						type: GAME_CONST.TOKEN_PLAYER_ONE_READABLE
					},
					{
						value: GAME_CONST.TOKEN_PLAYER_TWO,
						type: GAME_CONST.TOKEN_PLAYER_TWO_READABLE
					},
					{
						value: GAME_CONST.TOKEN_EMPTY,
						type: GAME_CONST.TOKEN_EMPTY_READABLE
					}
				]
			}
		],
		associatedObjects: [
			Turn.describe()
		]
	};
};



// ==== HELPER FUNCTIONS ====
function randomPlayer() {
	return Math.random() > 0.5 ? GAME_CONST.PLAYER_ONE_TURN : GAME_CONST.PLAYER_TWO_TURN;
}


function gameId() {
	return 'a' + base32.encode(randomId());
}

function randomId() {
	return randomIntFromInterval(ID_MIN_INT, ID_MAX_INT-1).toString();
}

function randomIntFromInterval(min,max) {
	return Math.floor(Math.random()*(max-min+1)+min);
}


function otherPlayer(activePlayer) {
	return activePlayer === GAME_CONST.PLAYER_ONE_TURN ? GAME_CONST.PLAYER_TWO_TURN : GAME_CONST.PLAYER_ONE_TURN;
}


function isValidPlayerId (players, pId) {
	return typeof players.find(p => p.id === pId) === 'object';
}


function isPlayersTurn (players, activePlayer, pId) {
	return players[activePlayer]['id'] === pId;
}


function nextToken(players) {
	return players.length === 0 ? GAME_CONST.TOKEN_PLAYER_ONE : GAME_CONST.TOKEN_PLAYER_TWO;
}



