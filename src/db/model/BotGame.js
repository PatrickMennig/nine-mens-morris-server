// ==== IMPORTS ====
const mongoose 						= require('mongoose');



const botGameSchema = mongoose.Schema({
	id: String,
	timeFinished: {type: Date, default: Date.now},
	status: {type: String, default: 'FINISHED'},
	groupId: String,
	winner: String
});



const BotGame = mongoose.model('BotGame', botGameSchema);

exports.newBotGame = (vals) => new BotGame(vals);
exports.model = BotGame;


exports.saveNew = (vals) => {
	return new Promise((resolve, reject) => {
		const g = new BotGame(vals);
		g.save(err => {
			if(err) {
				return reject(err);
			}
			return resolve(g);
		});
	});
};