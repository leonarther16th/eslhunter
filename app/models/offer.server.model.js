'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Offer Schema
 */
var OfferSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Offer name',
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
    school: {
        type: Schema.ObjectId,
        ref: 'School'
    },
    regions: {
        type: [Schema.ObjectId],
        ref: 'Region'
    }
});

mongoose.model('Offer', OfferSchema);
