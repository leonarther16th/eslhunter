'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	PostAssociation = mongoose.model('PostAssociation'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, postAssociation;

/**
 * Post association routes tests
 */
describe('Post association CRUD tests', function() {
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

		// Save a user to the test db and create new Post association
		user.save(function() {
			postAssociation = {
				name: 'Post association Name'
			};

			done();
		});
	});

	it('should be able to save Post association instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Post association
				agent.post('/post-associations')
					.send(postAssociation)
					.expect(200)
					.end(function(postAssociationSaveErr, postAssociationSaveRes) {
						// Handle Post association save error
						if (postAssociationSaveErr) done(postAssociationSaveErr);

						// Get a list of Post associations
						agent.get('/post-associations')
							.end(function(postAssociationsGetErr, postAssociationsGetRes) {
								// Handle Post association save error
								if (postAssociationsGetErr) done(postAssociationsGetErr);

								// Get Post associations list
								var postAssociations = postAssociationsGetRes.body;

								// Set assertions
								(postAssociations[0].user._id).should.equal(userId);
								(postAssociations[0].name).should.match('Post association Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Post association instance if not logged in', function(done) {
		agent.post('/post-associations')
			.send(postAssociation)
			.expect(401)
			.end(function(postAssociationSaveErr, postAssociationSaveRes) {
				// Call the assertion callback
				done(postAssociationSaveErr);
			});
	});

	it('should not be able to save Post association instance if no name is provided', function(done) {
		// Invalidate name field
		postAssociation.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Post association
				agent.post('/post-associations')
					.send(postAssociation)
					.expect(400)
					.end(function(postAssociationSaveErr, postAssociationSaveRes) {
						// Set message assertion
						(postAssociationSaveRes.body.message).should.match('Please fill Post association name');
						
						// Handle Post association save error
						done(postAssociationSaveErr);
					});
			});
	});

	it('should be able to update Post association instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Post association
				agent.post('/post-associations')
					.send(postAssociation)
					.expect(200)
					.end(function(postAssociationSaveErr, postAssociationSaveRes) {
						// Handle Post association save error
						if (postAssociationSaveErr) done(postAssociationSaveErr);

						// Update Post association name
						postAssociation.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Post association
						agent.put('/post-associations/' + postAssociationSaveRes.body._id)
							.send(postAssociation)
							.expect(200)
							.end(function(postAssociationUpdateErr, postAssociationUpdateRes) {
								// Handle Post association update error
								if (postAssociationUpdateErr) done(postAssociationUpdateErr);

								// Set assertions
								(postAssociationUpdateRes.body._id).should.equal(postAssociationSaveRes.body._id);
								(postAssociationUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Post associations if not signed in', function(done) {
		// Create new Post association model instance
		var postAssociationObj = new PostAssociation(postAssociation);

		// Save the Post association
		postAssociationObj.save(function() {
			// Request Post associations
			request(app).get('/post-associations')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Post association if not signed in', function(done) {
		// Create new Post association model instance
		var postAssociationObj = new PostAssociation(postAssociation);

		// Save the Post association
		postAssociationObj.save(function() {
			request(app).get('/post-associations/' + postAssociationObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', postAssociation.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Post association instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Post association
				agent.post('/post-associations')
					.send(postAssociation)
					.expect(200)
					.end(function(postAssociationSaveErr, postAssociationSaveRes) {
						// Handle Post association save error
						if (postAssociationSaveErr) done(postAssociationSaveErr);

						// Delete existing Post association
						agent.delete('/post-associations/' + postAssociationSaveRes.body._id)
							.send(postAssociation)
							.expect(200)
							.end(function(postAssociationDeleteErr, postAssociationDeleteRes) {
								// Handle Post association error error
								if (postAssociationDeleteErr) done(postAssociationDeleteErr);

								// Set assertions
								(postAssociationDeleteRes.body._id).should.equal(postAssociationSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Post association instance if not signed in', function(done) {
		// Set Post association user 
		postAssociation.user = user;

		// Create new Post association model instance
		var postAssociationObj = new PostAssociation(postAssociation);

		// Save the Post association
		postAssociationObj.save(function() {
			// Try deleting Post association
			request(app).delete('/post-associations/' + postAssociationObj._id)
			.expect(401)
			.end(function(postAssociationDeleteErr, postAssociationDeleteRes) {
				// Set message assertion
				(postAssociationDeleteRes.body.message).should.match('User is not logged in');

				// Handle Post association error error
				done(postAssociationDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		PostAssociation.remove().exec();
		done();
	});
});