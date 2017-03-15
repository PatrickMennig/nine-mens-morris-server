// ==== IMPORTS ====
const HTTP_VERBS 					= require('./const');
const botGame = require('../src/logic/botGame/public');
const versus  = require('../src/logic/versus/public');



// ==== LOCAL CONSTANTS ====
/**
 * Concat all routes from imported modules to one large array
 */
const routes = [
	{
		path: '/state',
		method: HTTP_VERBS.GET,
		handler: (req, res, next) => res.send('Online')
	}
];

exports.init = enableVersus => {
    botGame.init();
    routes.push(...botGame.routes(HTTP_VERBS));
    if (enableVersus) {
        versus.init();
        routes.push(...versus.routes(HTTP_VERBS));
    }
};



// ==== PUBLIC FUNCTIONS ====
exports.getRoutes = () => routes;

/**
 * Helper function for express server to let routes module create
 * appropriate listeners for all routes.
 *
 * @param app
 * @param route
 * @returns {*}
 */
exports.createRoute = (app, route) => {

	// check if route object is properly set up
	if(!route.path || !route.method || !route.handler) {
		throw new Error(`Incomplete route definition, check your public route: ${route}.`);
	}

	switch (route.method) {
		case HTTP_VERBS.GET:
			return app.get(route.path, route.handler);
		case HTTP_VERBS.PUT:
			return app.put(route.path, route.handler);
		case HTTP_VERBS.POST:
			return app.post(route.path, route.handler);
		case HTTP_VERBS.DELETE:
			return app.delete(route.path, route.handler);
		default:
			throw new Error(`Unable to find REST verb: ${route.method}, check your route definition: ${route}.`);
	}
};