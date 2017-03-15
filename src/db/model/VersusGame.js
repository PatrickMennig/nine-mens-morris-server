// ==== IMPORTS ====
const mongoose 						= require('mongoose');



const versusGameSchema = mongoose.Schema({
	id: String,
	timeFinished: {type: Date, default: Date.now},
	status: {type: String, default: 'FINISHED'},
	groupIds: [{type: String}],
	winner: String
});



const VersusGame = mongoose.model('VersusGame', versusGameSchema);

exports.newVersusGame = (vals) => new VersusGame(vals);
exports.model = VersusGame;


exports.saveNew = (vals) => {
	return new Promise((resolve, reject) => {
		const g = new VersusGame(vals);
		g.save(err => {
			if(err) {
				return reject(err);
			}
			return resolve(g);
		});
	});
};