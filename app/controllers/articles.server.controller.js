'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Article = mongoose.model('Article'),
	PostAssociation = mongoose.model('PostAssociation'),
	Answer = mongoose.model('Answer'),
	_ = require('lodash');

var ObjectId = mongoose.Types.ObjectId;

/**
 * Create a article
 */
exports.create = function(req, res) {
	var article = new Article(req.body);
	article.user = req.user;

	article.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			//creating association
			var postAssociation = new PostAssociation({
				article: article._id,
				user: req.user
			});
			postAssociation.save();
			res.json(article);
		}
	});
};

/**
 * Show the current article
 */
exports.read = function(req, res) {
	res.json(req.article);
};

/**
 * Update a article
 */
exports.update = function(req, res) {
	var article = req.article;

	article = _.extend(article, req.body);

	article.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(article);
		}
	});
};

/**
 * Delete an article
 */
exports.delete = function(req, res) {
	var article = req.article;

	article.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(article);
		}
	});
};

/**
 * List of Articles
 */
exports.list = function(req, res) {
	Article.find().sort('-created').populate('user', 'displayName').exec(function(err, articles) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(articles);
		}
	});
};

/**
 * Article middleware
 */
exports.articleByID = function(req, res, next, id) {
	Article.findById(id).populate('user', 'displayName').exec(function(err, article) {
		if (err) return next(err);
		if (!article) return next(new Error('Failed to load article ' + id));
		req.article = article;
		next();
	});
};

exports.asked = function(req, res) {
	// Article.find().sort('-created').populate('user', 'displayName').exec(function(err, articles) {
	// 	if (err) {
	// 		return res.status(400).send({
	// 			message: errorHandler.getErrorMessage(err)
	// 		});
	// 	} else {
	// 		res.json(articles);
	// 	}
	// });
	var re = new RegExp(req.query.search, 'i');
	var query = Article.find({});
	var search = req.query.search;
	query.where('title');
	query.regex(re);
	query.exec(function (err, articles){
	  if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				console.log(req.query.search);
				res.json(articles);
			}
	});

};


exports.userStats = function(req, res){

	var user_id = req.user._id;
	var articles_count = 0;
	var answers_count = 0;

	console.log(req.user);

	var getArticlesCount = function(callback){

		//getting number of questions posted by a user
		Article.count({user: new ObjectId(user_id)}).exec(function(err, articlesCount){
			if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					articles_count = articlesCount;
					if (callback) callback();
					
					
				}

		});

	};

	var getAnswersCount = function(callback) {

		//getting number of answers posted by a user
		Answer.count({user: new ObjectId(user_id)}).exec(function(err, answersCount){
			if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					answers_count = answersCount;
					if (callback) callback();

				}

		});

	};

	//console.log(getArticlesCount(console.log('4')));

	getArticlesCount(function(){
		getAnswersCount(function(){
		res.json({
			articles_count: articles_count,
			answers_count: answers_count
		});

		});
	});

	
	
};



exports.search = function(req, res) {
	var re = new RegExp(req.query.searchText, 'i');
	var query = Article.find({});

	var search = req.query.searchText;
	query.where('title');
	query.regex(re);
	query.exec(function (err, articles){
	  if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				console.log(req.query.searchText);
				res.json(articles);
			}
	});

};

/**
 * Article authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.article.user.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};
