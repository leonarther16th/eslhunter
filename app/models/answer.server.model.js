'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Answer Schema
 */
var AnswerSchema = new Schema({
	content: {
		type: String,
		default: '',
		required: 'Please fill Answer content',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	article_id: {
		type: String,
		default: '',
		trim: true
	}

});


mongoose.model('Answer', AnswerSchema);
