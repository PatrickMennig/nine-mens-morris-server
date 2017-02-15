// ==== IMPORTS ====
const config						= require('../../config');
const mongoose 						= require('mongoose');



// ==== STATIC VARIABLES ====
let db = null;
let sleep = 500;



const onError = (err) => {
	console.error('[Database connection] : Error in MongoDb connection: ' + err);
	mongoose.disconnect();
};
const onConnect = () => {
	sleep = 500;
	console.info(`[Database connection] : Connection to database established`);
};
const onDisconnect = () => {
	if(sleep > 64000) {
		throw new Error(`[Database connection] : Reconnect to database failed permanently`);
	}
	setTimeout(()=>{
		sleep *= 2;
		mongoose.connect(config.database.connecturl)
	},sleep)
	;
};


const init = () => {
	mongoose.connect(config.database.connecturl);
	db = mongoose.connection;
	db.on('error', onError);
	db.on('open', onConnect);
	db.on('disconnected', onDisconnect);
};

exports.init = init;