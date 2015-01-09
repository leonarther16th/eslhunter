'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	ArticleLike = mongoose.model('ArticleLike'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, articleLike;

/**
 * Article like routes tests
 */
describe('Article like CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Article like
		user.save(function() {
			articleLike = {
				name: 'Article like Name'
			};

			done();
		});
	});

	it('should be able to save Article like instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Article like
				agent.post('/article-likes')
					.send(articleLike)
					.expect(200)
					.end(function(articleLikeSaveErr, articleLikeSaveRes) {
						// Handle Article like save error
						if (articleLikeSaveErr) done(articleLikeSaveErr);

						// Get a list of Article likes
						agent.get('/article-likes')
							.end(function(articleLikesGetErr, articleLikesGetRes) {
								// Handle Article like save error
								if (articleLikesGetErr) done(articleLikesGetErr);

								// Get Article likes list
								var articleLikes = articleLikesGetRes.body;

								// Set assertions
								(articleLikes[0].user._id).should.equal(userId);
								(articleLikes[0].name).should.match('Article like Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Article like instance if not logged in', function(done) {
		agent.post('/article-likes')
			.send(articleLike)
			.expect(401)
			.end(function(articleLikeSaveErr, articleLikeSaveRes) {
				// Call the assertion callback
				done(articleLikeSaveErr);
			});
	});

	it('should not be able to save Article like instance if no name is provided', function(done) {
		// Invalidate name field
		articleLike.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Article like
				agent.post('/article-likes')
					.send(articleLike)
					.expect(400)
					.end(function(articleLikeSaveErr, articleLikeSaveRes) {
						// Set message assertion
						(articleLikeSaveRes.body.message).should.match('Please fill Article like name');
						
						// Handle Article like save error
						done(articleLikeSaveErr);
					});
			});
	});

	it('should be able to update Article like instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Article like
				agent.post('/article-likes')
					.send(articleLike)
					.expect(200)
					.end(function(articleLikeSaveErr, articleLikeSaveRes) {
						// Handle Article like save error
						if (articleLikeSaveErr) done(articleLikeSaveErr);

						// Update Article like name
						articleLike.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Article like
						agent.put('/article-likes/' + articleLikeSaveRes.body._id)
							.send(articleLike)
							.expect(200)
							.end(function(articleLikeUpdateErr, articleLikeUpdateRes) {
								// Handle Article like update error
								if (articleLikeUpdateErr) done(articleLikeUpdateErr);

								// Set assertions
								(articleLikeUpdateRes.body._id).should.equal(articleLikeSaveRes.body._id);
								(articleLikeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Article likes if not signed in', function(done) {
		// Create new Article like model instance
		var articleLikeObj = new ArticleLike(articleLike);

		// Save the Article like
		articleLikeObj.save(function() {
			// Request Article likes
			request(app).get('/article-likes')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Article like if not signed in', function(done) {
		// Create new Article like model instance
		var articleLikeObj = new ArticleLike(articleLike);

		// Save the Article like
		articleLikeObj.save(function() {
			request(app).get('/article-likes/' + articleLikeObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', articleLike.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Article like instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Article like
				agent.post('/article-likes')
					.send(articleLike)
					.expect(200)
					.end(function(articleLikeSaveErr, articleLikeSaveRes) {
						// Handle Article like save error
						if (articleLikeSaveErr) done(articleLikeSaveErr);

						// Delete existing Article like
						agent.delete('/article-likes/' + articleLikeSaveRes.body._id)
							.send(articleLike)
							.expect(200)
							.end(function(articleLikeDeleteErr, articleLikeDeleteRes) {
								// Handle Article like error error
								if (articleLikeDeleteErr) done(articleLikeDeleteErr);

								// Set assertions
								(articleLikeDeleteRes.body._id).should.equal(articleLikeSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Article like instance if not signed in', function(done) {
		// Set Article like user 
		articleLike.user = user;

		// Create new Article like model instance
		var articleLikeObj = new ArticleLike(articleLike);

		// Save the Article like
		articleLikeObj.save(function() {
			// Try deleting Article like
			request(app).delete('/article-likes/' + articleLikeObj._id)
			.expect(401)
			.end(function(articleLikeDeleteErr, articleLikeDeleteRes) {
				// Set message assertion
				(articleLikeDeleteRes.body.message).should.match('User is not logged in');

				// Handle Article like error error
				done(articleLikeDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		ArticleLike.remove().exec();
		done();
	});
});