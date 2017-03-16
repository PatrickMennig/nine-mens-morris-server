// ==== STATIC VAR ====
const store    = {};
let intervalId = null;
let messageBus = null;


//Todo: make this to a class to avoid duplicate code
exports.init = (bus) => {
    messageBus = bus;
};


// ==== PUBLIC FUNCTIONS ====
exports.save = (game) => {
    // check for duplicate
    if (store[game.id]) {
        throw new Error(`Duplicate game id in store: ${game.id}.`);
    }
    store[game.id] = game;
};


exports.get = (gameId) => {
    const game = store[gameId];
    if (!game) {
        throw new Error(`No game with the given id: ${gameId} was found.`);
    }
    return game;
};


exports.isSet = (gameId) => {
    return store[gameId] !== null && typeof store[gameId] !== 'undefined';
};


exports.getAll = () => {
    return Object.keys(store).map(key => store[key]);
};


exports.delete = (gameId) => {
    delete store[gameId];
};


exports.startCleanTask = () => {
    intervalId = setInterval(cleanStore, 1 * 1000);
};


exports.stopCleanTask = () => {
    clearInterval(intervalId);
};


// ==== HELPER FUNCTIONS ====
// TODO Refactor
function cleanStore() {
    const now = new Date().getTime();
    Object.keys(store).map(k => {
        if (now - store[k].lastTurnPlayedAt > 60 * 1000) {

            const game = store[k];

            if (game.status === require('../../game/const').GAME_TIMED_OUT) {
                return;
            }

            game.setTimeoutState();

            const playerIds = game.players.map(p => p.id);
            playerIds.forEach(pid => {
                messageBus.emit(`wait-for-disconnect-${game.id}-${pid}`, {
                    status: 201,
                    result: `Game has ended, active player timed out.`
                });
            });

            const otherPlayer   = game.getOtherPlayer();
            const otherPlayerId = otherPlayer ? otherPlayer.id : -1;

            messageBus.emit('save-game', {
                winnerId: otherPlayerId,
                game: game
            });
        }
        if (now - store[k].creationTime > 7 * 24 * 60 * 60 * 1000) {
            //store[k].setToDeleteState();
            // Todo: delete?
        }
    });
}