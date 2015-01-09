'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	PostAssociation = mongoose.model('PostAssociation'),
	_ = require('lodash');

/**
 * Create a Post association
 */
exports.create = function(req, res) {
	var postAssociation = new PostAssociation(req.body);
	postAssociation.user = req.user;

	postAssociation.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(postAssociation);
		}
	});
};

/**
 * Show the current Post association
 */
exports.read = function(req, res) {
	res.jsonp(req.postAssociation);
};

/**
 * Update a Post association
 */
exports.update = function(req, res) {
	var postAssociation = req.postAssociation ;

	postAssociation = _.extend(postAssociation , req.body);

	postAssociation.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(postAssociation);
		}
	});
};

/**
 * Delete an Post association
 */
exports.delete = function(req, res) {
	var postAssociation = req.postAssociation ;

	postAssociation.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(postAssociation);
		}
	});
};

/**
 * List of Post associations
 */
exports.list = function(req, res) { 
	PostAssociation.find().sort('-created').populate('user', 'displayName').exec(function(err, postAssociations) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(postAssociations);
		}
	});
};

/**
 * Post association middleware
 */
exports.postAssociationByID = function(req, res, next, id) { 
	PostAssociation.findById(id).populate('user', 'displayName').exec(function(err, postAssociation) {
		if (err) return next(err);
		if (! postAssociation) return next(new Error('Failed to load Post association ' + id));
		req.postAssociation = postAssociation ;
		next();
	});
};

/**
 * Post association authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.postAssociation.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
