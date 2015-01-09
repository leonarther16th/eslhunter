'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var postAssociations = require('../../app/controllers/post-associations.server.controller');

	// Post associations Routes
	app.route('/post-associations')
		.get(postAssociations.list)
		.post(users.requiresLogin, postAssociations.create);

	app.route('/post-associations/:postAssociationId')
		.get(postAssociations.read)
		.put(users.requiresLogin, postAssociations.hasAuthorization, postAssociations.update)
		.delete(users.requiresLogin, postAssociations.hasAuthorization, postAssociations.delete);

	// Finish by binding the Post association middleware
	app.param('postAssociationId', postAssociations.postAssociationByID);
};
