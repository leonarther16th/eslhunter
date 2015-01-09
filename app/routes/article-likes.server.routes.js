'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var articleLikes = require('../../app/controllers/article-likes.server.controller');

	// Article likes Routes
	app.route('/article-likes')
		.get(articleLikes.list)
		.post(users.requiresLogin, articleLikes.create);

	app.route('/article-likes/:articleLikeId')
		.get(articleLikes.read)
		.put(users.requiresLogin, articleLikes.hasAuthorization, articleLikes.update)
		.delete(users.requiresLogin, articleLikes.hasAuthorization, articleLikes.delete);

	// Finish by binding the Article like middleware
	app.param('articleLikeId', articleLikes.articleLikeByID);
};
