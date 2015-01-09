'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	ArticleLike = mongoose.model('ArticleLike'),
	_ = require('lodash');

/**
 * Create a Article like
 */
exports.create = function(req, res) {
	var articleLike = new ArticleLike(req.body);
	articleLike.user = req.user;

	articleLike.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(articleLike);
		}
	});
};

/**
 * Show the current Article like
 */
exports.read = function(req, res) {
	res.jsonp(req.articleLike);
};

/**
 * Update a Article like
 */
exports.update = function(req, res) {
	var articleLike = req.articleLike ;

	articleLike = _.extend(articleLike , req.body);

	articleLike.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(articleLike);
		}
	});
};

/**
 * Delete an Article like
 */
exports.delete = function(req, res) {
	var articleLike = req.articleLike ;

	articleLike.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(articleLike);
		}
	});
};

/**
 * List of Article likes
 */
exports.list = function(req, res) { 
	ArticleLike.find().sort('-created').populate('user', 'displayName').exec(function(err, articleLikes) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(articleLikes);
		}
	});
};

/**
 * Article like middleware
 */
exports.articleLikeByID = function(req, res, next, id) { 
	ArticleLike.findById(id).populate('user', 'displayName').exec(function(err, articleLike) {
		if (err) return next(err);
		if (! articleLike) return next(new Error('Failed to load Article like ' + id));
		req.articleLike = articleLike ;
		next();
	});
};

/**
 * Article like authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.articleLike.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
