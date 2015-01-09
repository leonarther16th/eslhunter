'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Post association Schema
 */
var PostAssociationSchema = new Schema({
	
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	article: {
		type: Schema.ObjectId,
		ref: 'Article'
	}
});

mongoose.model('PostAssociation', PostAssociationSchema);
