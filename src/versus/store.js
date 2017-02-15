// ==== STATIC VAR ====
let store = {};
let intervalId = null;



//Todo: make this to a class to avoid duplicate code



// ==== PUBLIC FUNCTIONS ====
exports.save = (game) => {
	// check for duplicate
	if(store[game.id]) {
		throw new Error(`Duplicate game id in store: ${game.id}.`);
	}
	store[game.id] = game;
};


exports.get = (gameId) => {
	const game = store[gameId];
	if(!game) {
		throw new Error(`No game with the given id: ${gameId} was found.`);
	}
	return game;
};


exports.isSet = (gameId) => {
	return store[gameId] !== null && typeof store[gameId] !== 'undefined';
};


exports.getAll = () => {
	// return a deep copy, not a reference
	return Object.keys(store).map(key => JSON.parse(JSON.stringify(store[key])));
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
function cleanStore() {
	const now = new Date().getTime();
	Object.keys(store).map(k => {
		if(now - store[k].lastTurnPlayedAt > 60 * 1000) {
			store[k].setTimeoutState();
		}
		if(now - store[k].creationTime > 7 * 24 * 60 * 60 * 1000) {
			store[k].setToDeleteState();
		}
	});
}