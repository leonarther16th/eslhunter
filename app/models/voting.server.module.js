'use strict';

/**
 * Created by Moe Katib on 15-01-12.
 */


/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    ObjectId = mongoose.Schema.ObjectId;

/**
 * Mongoose Voting Plugin
 * https://github.com/cristiandouce/mongoose-voting
 *
 * @param {Schema} schema MongooseSchema
 * @param {Object} options for plugin configuration
 * @api public
 */

function voting(schema) {


    var voterModelName =  'User';

    schema.add({
        vote: {
            positive: [{ type: ObjectId, ref: voterModelName }],
            negative: [{ type: ObjectId, ref: voterModelName }]
        }
    });

    schema.methods.upvote = function upvote(user, fn) {
        // Reset vote if existed
        this.vote.negative.pull(user);

        // Upvote
        this.vote.positive.addToSet(user);

        // If callback fn, save and return
        if (2 === arguments.length) {
            this.save(fn);
        }
    };

    schema.methods.downvote = function downvote(user, fn) {
        // Reset vote if existed
        this.vote.positive.pull(user);

        // Downvote
        this.vote.negative.addToSet(user);

        // If callback fn, save and return
        if (2 === arguments.length) {
            this.save(fn);
        }
    };

    schema.methods.unvote = function unvote(user, fn) {
        this.vote.negative.pull(user);
        this.vote.positive.pull(user);

        // If callback fn, save and return
        if (2 === arguments.length) {
            this.save(fn);
        }
    };

    schema.methods.upvoted = function upvoted(user) {
        if (user._id) {
            return schema.methods.upvoted.call(this, user._id);
        }

        return !!~this.vote.positive.indexOf(user);
    };

    schema.methods.downvoted = function downvoted(user) {
        if (user._id) {
            return schema.methods.downvoted.call(this, user._id);
        }

        return !!~this.vote.negative.indexOf(user);
    };

    schema.methods.voted = function voted(user) {
        if (user._id) {
            return schema.methods.voted.call(this, user._id);
        }

        return schema.methods.upvoted(user) || schema.methods.downvoted(user);
    };

    schema.methods.upvotes = function upvotes() {
        return this.vote.positive.length;
    };

    schema.methods.downvotes = function upvotes() {
        return this.vote.negative.length;
    };

    schema.methods.votes = function upvotes() {
        var positives = this.vote.positive;
        var negatives = this.vote.negative;
        return [].concat(positives).concat(negatives).length;
    };

}

/**
 * Expose mongoose voting
 */

module.exports = exports = voting;
