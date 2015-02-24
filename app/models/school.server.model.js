'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * School Schema
 */
var SchoolSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill School name',
		trim: true
	},
    city:{
        type: String,
		default: '',
		required: 'Please fill in the city',
		trim: true
    },
    country: {
        type: String,
		default: '',
		required: 'Please fill in the country',
		trim: true
    },
    about: {
        type: String,
		default: '',
		trim: true
    },
    avatar: {
        type: String,
		default: '',
		trim: true
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

mongoose.model('School', SchoolSchema);
