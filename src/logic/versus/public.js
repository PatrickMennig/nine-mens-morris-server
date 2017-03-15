// ==== IMPORTS ====
const EventEmitter = require('events').EventEmitter;
const messageBus  = new EventEmitter();
const Game        = require('../../game/Game');
const gameFactory = require('../../game/gameFactory');
const validation  = require('../../game/validation');
const store       = require('./store');
const VersusGame  = require('../../db/model/VersusGame');


// ==== LOCAL CONSTANTS ====
const ROOT_ROUTE = '/versus';

const AVAILABLE_ROUTES = {
    DESCRIBE: ROOT_ROUTE,
    OFFER: `${ROOT_ROUTE}/offer`,
    JOIN: `${ROOT_ROUTE}/join`,
    PLAY_TURN: `${ROOT_ROUTE}/playturn`,
    ACTIVE_GAMES: `${ROOT_ROUTE}/games`,
    ACTIVE_GAME: `${ROOT_ROUTE}/games/:id`,
    GAME_BOARD_STATE_VISUAL: `${ROOT_ROUTE}/games/:id/visual`
};


// ==== PUBLIC FUNCTIONS ====
exports.init = () => {
    store.startCleanTask();
    store.init(messageBus);
};


// ==== STORE EVENT LISTENER
messageBus.on('save-game', result => {
    // Todo: save game to database
    const {winnerId, game} = result;
    VersusGame.saveNew();
});


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
            path: AVAILABLE_ROUTES.OFFER,
            method: httpVerbs.POST,
            desc: 'Allows you to offer a game and receive a new game id.',
            handler: offerGame
        },
        {
            path: AVAILABLE_ROUTES.JOIN,
            method: httpVerbs.POST,
            desc: 'Allows you to join a game with with another team by sending the game id from the offer.',
            handler: joinGame
        },
        {
            path: AVAILABLE_ROUTES.PLAY_TURN,
            method: httpVerbs.POST,
            desc: 'Play one turn. Supply the new board state and your turn in body as json. Supply your groupId and the gameId as url parameter ?groupid=&gameid=. Returns the new board state. Other player plays his turn immediately after you play yours so its turn is included in the new board state.',
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
const offerGame = (req, res, next) => {

    let groupId;

    validation
        .isAcceptable(validation.GROUP_ID, req.query['groupid'])
        .then(id => {
            groupId = id
        })
        .then(null, err => endChain(err))
        .then(() => gameFactory.create({}, {}, game => store.isSet(game.id)))
        .then(null, err => endChain(err))
        .then(game => {
            store.save(game);
            res.json({
                status: 'Game offer accepted, you and the other team have to join the game now.',
                gameId: game.id
            });
        })
        .then(null, err => endChain(err))
        .catch(err => declineRequest(400, err.message, res));

};


const joinGame = (req, res, next) => {

    let groupId;
    let gameId;
    let game;

    validation
        .isAcceptable(validation.GROUP_ID, req.query['groupid'])
        .then(id => {
            groupId = id;
        })
        .then(null, err => endChain(err))
        .then(() => validation.isAcceptable(validation.GAME_ID, req.query['gameid'], store))
        .then(id => {
            gameId = id;
        })
        .then(null, err => endChain(err))
        .then(() => {
            game = store.get(gameId);
        })
        .then(null, err => endChain(err))
        .then(() => validation.isAcceptable(validation.GAME_OFFERING_STATE, game))
        .then(game => {

            if (game.getPlayerById(groupId)) {
                throw new Error(`Player with groupId: ${groupId} already joined the game.`);
            }

            game.addPlayer(groupId, Game.PLAYER_HUMAN);

            // is this the first or second player joining?
            const numberOfPlayers = game.numberOfPlayers();

            if (numberOfPlayers === 1) {
                // first player joining
                // just wait till 2nd player joined
                messageBus.once(`wait-for-join-${game.id}`, () => {
                    handleConnect();
                });
                messageBus.once(`wait-for-disconnect-${game.id}-${groupId}`, (result, game) => sendResult(res, result, game));
            }

            if (numberOfPlayers === 2) {
                // second player joining
                messageBus.once(`wait-for-disconnect-${game.id}-${groupId}`, (result, game) => sendResult(res, result, game));
                // start the game and handle the "all players joined" event
                game.startGame();
                messageBus.emit(`wait-for-join-${game.id}`);
                handleConnect();
            }


            function handleConnect() {
                // find out who is the first player
                const activePlayerId = game.getActivePlayer().id;

                // active player has to make a turn
                if (groupId === activePlayerId) {
                    sendResult(
                        res,
                        {
                            status: 200,
                            result: game.emptyTurnResult()
                        },
                        game
                    );
                }
                // wait till active player has made it's turn and then handle it normally
                else {
                    messageBus.once(`wait-for-turn-${game.id}-${groupId}`, result => {
                        sendResult(res, result, game);
                    });
                }
            }
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
        .then(() => game = store.get(gameId))
        .then(null, err => endChain(err))
        .then(() => validation.isAcceptable(validation.TURN, req.body))
        .then(null, err => endChain(err))
        .then(t => turn = t)
        .then(() => {

            // execute turn ....
            const turnResult = game.executeTurn(groupId, turn);

            if (turnResult.error) {
                return Promise.reject(new Error(`The turn supplied was not valid. ${groupId} automatically lost the game: ${turnResult.error} If you feel this is an error with the server, please contact an administrator.`));
            }

            if (turnResult.winner) {
                messageBus.emit(`wait-for-turn-${gameId}-${game.getActivePlayer().id}`, {
                    status: 201,
                    result: `${groupId} has won the game, you lost.`
                });

                messageBus.emit('save-game', {
                    winnerId: groupId,
                    game: game
                });

                return sendResult(
                    res,
                    {
                        status: 201,
                        result: `You have won the game, ${game.getOtherPlayer().id} lost.`
                    },
                    game);
            }

            // next player should now be set...
            // notify other player
            messageBus.emit(`wait-for-turn-${gameId}-${game.getActivePlayer().id}`, {
                status: 200,
                result: turnResult
            });

            // make just requesting player wait
            messageBus.once(`wait-for-turn-${gameId}-${groupId}`, result => {
                sendResult(res, result, game);
            });

        })
        .then(null, err => endChain(err))
        .catch(err => {

            // dont forget to notify the other player upon error
            messageBus.emit(`wait-for-turn-${gameId}-${game.getOtherPlayer().id}`, {
                status: 201,
                result: `Other player made a mistake: ${err.message} ${game.getOtherPlayer().id} automatically won the game.`
            });

            return declineRequest(400, err.message, res);
        });
};


const activeGame = (req, res, next) => {

    validation
        .isAcceptable(validation.GAME_ID, req.params['id'], store)
        .then(id => res.json(store.get(id)))
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
    if (obj === null) {
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

const sendResult = (res, result, game) => {
    if (result.status === 200) {
        return res.json({
            id: game.id,
            activePlayer: game.activePlayer,
            creationTime: game.creationTime,
            turnResult: replaceNullNumbers(result.result, 'turn', ['fromId', 'toId', 'removeId'], Game.NO_ID)
        });
    } else {
        res.status(201);
        return res.send(result.result);
    }
};