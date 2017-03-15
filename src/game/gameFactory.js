const Game 							= require('./Game');


const create = (playerOne, playerTwo, isDuplicateFn) => {

	return new Promise((resolve, reject) => {

		let game;
		let retries = 0;
		const MAX_RETRIES = 100;

		do {
			game = createGame(playerOne, playerTwo);
			retries++;
			if(retries == MAX_RETRIES) {
				break;
			}
        } while (isDuplicateFn(game));

		if(!game) {
			reject(new Error('Temporarily unable to create game, please try again later. Maybe all slots are occupied. If the problem persists, please contact an administrator.'))
		}

		resolve(game);

	});
};

exports.create = create;



function createGame(playerOne, playerTwo={}) {
	return new Game(playerOne.id, playerOne.type, playerTwo.id, playerTwo.type);
}