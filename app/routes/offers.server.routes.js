'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var offers = require('../../app/controllers/offers.server.controller');

	// Offers Routes
	app.route('/offers')
		.get(offers.list)
		.post(users.requiresLogin, offers.create);

	app.route('/offers/:offerId')
		.get(offers.read)
		.put(users.requiresLogin, offers.hasAuthorization, offers.update)
		.delete(users.requiresLogin, offers.hasAuthorization, offers.delete);

	// Finish by binding the Offer middleware
	app.param('offerId', offers.offerByID);
};
