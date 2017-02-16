// ==== IMPORTS ====
const express 						= require('express');
const bodyParser 					= require('body-parser');
const routes 						= require('./routes/routes').getRoutes();
const createRoute 					= require('./routes/routes').createRoute;
const config  						= require('./config');
const mongo							= require('./src/db/mongoose');



/* create express app */
const app = express();
app.use(bodyParser.json());



/* connect to the database */
mongo.init();



/* setup route handlers for all routes imported in ./routes/routes */
routes.forEach(r => {
	console.log(`[Server adding route] : ${r.method} http://localhost:${config.server.PORT}${r.path}`);
	createRoute(app, r);
});



/* start the server on the PORT specified in config */
app.listen(config.server.PORT, () => {
	console.log(`[Server is running]   : Game server is listening on http://localhost:${config.server.PORT}`);
});


module.exports = app;
