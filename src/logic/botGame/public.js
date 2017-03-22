// ==== IMPORTS ====
const gameFactory  = require('../../game/gameFactory');
const validation   = require('../../game/validation');
const ai           = require('./ai/ai');
const BotGame      = require('../../db/model/BotGame');
const Game         = require('../../game/Game');
const GameResponse = require('../communication/GameResponse');
const Store        = require('../store/Store');
const store        = new Store();
const superagent   = require('superagent');


// ==== LOCAL CONSTANTS ====
const ROOT_ROUTE = '/botgame';

const AVAILABLE_ROUTES = {
    DESCRIBE: ROOT_ROUTE,
    JOIN: `${ROOT_ROUTE}/join`,
    PLAY_TURN: `${ROOT_ROUTE}/playturn`,
    ACTIVE_GAMES: `${ROOT_ROUTE}/games`,
    ACTIVE_GAME: `${ROOT_ROUTE}/games/:id`,
    GAME_BOARD_STATE_VISUAL: `${ROOT_ROUTE}/games/:id/visual`
};


// ==== PUBLIC FUNCTIONS ====
exports.init = () => {
    store.initCleaning('lastTurnPlayedAt', game => game.setTimeoutState());
};


// ==== PUBLIC ROUTES ====
let routes = (httpVerbs) => {

    routes = () => [
        {
            path: AVAILABLE_ROUTES.DESCRIBE,
            method: httpVerbs.GET,
            desc: 'Returns the description of this module.',
            handler: describe
        },
        {
            path: AVAILABLE_ROUTES.JOIN,
            method: httpVerbs.POST,
            desc: 'Allows you to join a game with the test bot.',
            handler: joinGame
        },
        {
            path: AVAILABLE_ROUTES.PLAY_TURN,
            method: httpVerbs.POST,
            desc: 'Play one turn. Supply the new board state and your turn in body as json. Supply your groupId and the gameId as url parameter ?groupid=&gameid=. Returns the new board state. Bot plays his turn immediately after you play yours so its turn is include in the new board state.',
            handler: playTurn
        },
        {
            path: AVAILABLE_ROUTES.ACTIVE_GAME,
            method: httpVerbs.GET,
            desc: 'Get the state of a specific game, returns the complete game object.',
            handler: activeGame

        },
        {
            path: AVAILABLE_ROUTES.ACTIVE_GAMES,
            method: httpVerbs.GET,
            desc: 'Get a list of all currently active games with the bot.',
            handler: activeGames
        },
        {
            path: AVAILABLE_ROUTES.GAME_BOARD_STATE_VISUAL,
            method: httpVerbs.GET,
            desc: 'See a visual representation of the last available board state for the game with the supplied id.',
            handler: visual
        }
    ];

    return routes();
};

exports.routes = routes;


// ==== ROUTES HANDLERS ====
const joinGame = (req, res, next) => {

    let groupId;

    validation.isAcceptable(validation.GROUP_ID, req.query['groupid'])
        .then(id => groupId = id)
        .then(null, err => endChain(err))
        .then(() => gameFactory.create({id: groupId, type: Game.PLAYER_HUMAN}, {
            id: 0,
            type: Game.PLAYER_BOT
        }, game => store.isSet(game.id)))
        .then(null, err => endChain(err))
        .then(game => {

            store.put(game.id, game);
            game.startGame();

            superagent
                .post('https://hooks.slack.com/services/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')
                .send({text: `Team ${groupId} begins a new botgame!`})
                .end();

            let turnResult = null;
            if (game.isBotActive()) {
                turnResult = game.executeBotTurn(ai);
            }

            console.log('Join Game:');
            console.dir(GameResponse.res(GameResponse.STATUS.NEXT_TURN, game, replaceNullNumbers(turnResult, 'turn', ['fromId', 'toId', 'removeId'], Game.NO_ID)));

            res.json(GameResponse.res(GameResponse.STATUS.NEXT_TURN, game, replaceNullNumbers(turnResult, 'turn', ['fromId', 'toId', 'removeId'], Game.NO_ID)));

            /*
            res.json({
                id: game.id,
                activePlayer: game.activePlayer,
                creationTime: game.creationTime,
                turnResult: replaceNullNumbers(turnResult, 'turn', ['fromId', 'toId', 'removeId'], Game.NO_ID)
            });
             */

        })
        .then(null, err => endChain(err))
        .catch(err => declineRequest(400, err.message, res));
};


const playTurn = (req, res, next) => {

    let groupId;
    let gameId;
    let game;
    let turn;

    validation
        .isAcceptable(validation.GROUP_ID, req.query['groupid'])
        .then(id => groupId = id)
        .then(null, err => endChain(err))
        .then(() => validation.isAcceptable(validation.GAME_ID, req.query['gameid'], store))
        .then(id => gameId = id)
        .then(null, err => endChain(err))
        .then(() => {
            game = store.get(gameId);
            if (!game) {
                throw new Error(`Game with id: ${gameId} does not exist on server.`);
            }
        })
        .then(null, err => endChain(err))
        .then(() => validation.isAcceptable(validation.TURN, req.body))
        .then(null, err => endChain(err))
        .then(t => turn = t)
        .then(() => {
            // now we have a valid groupId, gameId, game and turn
            const turnResult = game.executeTurn(groupId, turn);

            if (turnResult.error) {
                // console.log('############# PLAYER ERROR #############');
                return Promise.reject(new Error(`The turn supplied was not valid. You automatically lost the game: ${turnResult.error} If you feel this is an error with the server, please contact an administrator.`));
            }

            if (turnResult.winner) {

                superagent
                    .post('https://hooks.slack.com/services/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')
                    .send({text: `Team ${groupId} has won a botgame!`})
                    .end();


                console.log('Player has won.');

                return BotGame.saveNew({
                    id: game.id,
                    groupId: groupId,
                    winner: groupId
                }).then(() => Promise.resolve({
                    status: GameResponse.STATUS.VICTORY,
                    result: null
                }))
                    .then(null, err => endChain(err));
            }

            const botTurnResult = game.executeBotTurn(ai);

            if (botTurnResult.winner) {

                superagent
                    .post('https://hooks.slack.com/services/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')
                    .send({text: `Team ${groupId} has lost a botgame!`})
                    .end();

                console.log('Bot has won.');

                return (
                    BotGame.saveNew({
                        id: game.id,
                        groupId: groupId,
                        winner: '0'
                    })
                        .then(() => Promise.resolve({
                            status: GameResponse.STATUS.LOSS,
                            result: null
                        }))
                        .then(null, err => endChain(err))
                );
            }

            return Promise.resolve({
                status: GameResponse.STATUS.NEXT_TURN,
                result: replaceNullNumbers(botTurnResult, 'turn', ['fromId', 'toId', 'removeId'], Game.NO_ID)
            });

        })
        .then(result => {
            console.log('Send Play Turn Result:');
            console.dir(GameResponse.res(result.status, game, result.result));
            res.json(GameResponse.res(result.status, game, result.result));
        })
        .then(null, err => endChain(err))
        .catch(err => declineRequest(400, err.message, res));
};


const activeGame = (req, res, next) => {

    validation
        .isAcceptable(validation.GAME_ID, req.params['id'], store)
        .then(id => {
            const game = store.get(id);
            if (!game) {
                throw new Error(`Game with id: ${id} does not exist on server.`);
            }
            res.json(game);
        })
        .then(null, err => endChain(err))
        .catch(err => declineRequest(400, err.message, res));

};


const activeGames = (req, res, next) => {
    res.json(store.getAll());
    return next();
};


const visual = (req, res, next) => {

    validation
        .isAcceptable(validation.GAME_ID, req.params['id'], store)
        .then(id => res.json(store.get(id).boardStateVisual()))
        .then(null, err => endChain(err))
        .catch(err => declineRequest(400, err.message, res));

};


const describe = (req, res, next) => {
    res.json({
        actions: [
            ...routes()
        ],
        objects: [
            Game.describe()
        ]
    });
    return next();
};


// ==== HELPER FUNCTIONS ====
const declineRequest = (code, msg, res) => {
    res.status(code);
    res.send(msg);
};

const endChain = (err) => {
    throw new Error(err.message);
};

const replaceNullNumbers = (obj, prop, keys, replacement) => {
    if (obj == null) {
        return obj;
    }
    Object.keys(obj[prop]).forEach(key => {
        if (obj[prop].hasOwnProperty(key)) {
            if (obj[prop][key] === null && keys.includes(key)) {
                obj[prop][key] = replacement;
            }
        }
    });
    return obj;
};