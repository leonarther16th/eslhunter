'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var regions = require('../../app/controllers/regions.server.controller');

	// Regions Routes
	app.route('/regions')
		.get(regions.list)
		.post(users.requiresLogin, regions.create);

	app.route('/regions/:regionId')
		.get(regions.read)
		.put(users.requiresLogin, regions.hasAuthorization, regions.update)
		.delete(users.requiresLogin, regions.hasAuthorization, regions.delete);

	// Finish by binding the Region middleware
	app.param('regionId', regions.regionByID);
};
