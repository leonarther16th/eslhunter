'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Article like Schema
 */
var ArticleLikeSchema = new Schema({
	article: {
		type: Schema.ObjectId,
		ref: 'Article'
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('ArticleLike', ArticleLikeSchema);
