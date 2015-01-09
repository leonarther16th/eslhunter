'use strict';

(function() {
	// Article likes Controller Spec
	describe('Article likes Controller Tests', function() {
		// Initialize global variables
		var ArticleLikesController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Article likes controller.
			ArticleLikesController = $controller('ArticleLikesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Article like object fetched from XHR', inject(function(ArticleLikes) {
			// Create sample Article like using the Article likes service
			var sampleArticleLike = new ArticleLikes({
				name: 'New Article like'
			});

			// Create a sample Article likes array that includes the new Article like
			var sampleArticleLikes = [sampleArticleLike];

			// Set GET response
			$httpBackend.expectGET('article-likes').respond(sampleArticleLikes);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.articleLikes).toEqualData(sampleArticleLikes);
		}));

		it('$scope.findOne() should create an array with one Article like object fetched from XHR using a articleLikeId URL parameter', inject(function(ArticleLikes) {
			// Define a sample Article like object
			var sampleArticleLike = new ArticleLikes({
				name: 'New Article like'
			});

			// Set the URL parameter
			$stateParams.articleLikeId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/article-likes\/([0-9a-fA-F]{24})$/).respond(sampleArticleLike);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.articleLike).toEqualData(sampleArticleLike);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(ArticleLikes) {
			// Create a sample Article like object
			var sampleArticleLikePostData = new ArticleLikes({
				name: 'New Article like'
			});

			// Create a sample Article like response
			var sampleArticleLikeResponse = new ArticleLikes({
				_id: '525cf20451979dea2c000001',
				name: 'New Article like'
			});

			// Fixture mock form input values
			scope.name = 'New Article like';

			// Set POST response
			$httpBackend.expectPOST('article-likes', sampleArticleLikePostData).respond(sampleArticleLikeResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Article like was created
			expect($location.path()).toBe('/article-likes/' + sampleArticleLikeResponse._id);
		}));

		it('$scope.update() should update a valid Article like', inject(function(ArticleLikes) {
			// Define a sample Article like put data
			var sampleArticleLikePutData = new ArticleLikes({
				_id: '525cf20451979dea2c000001',
				name: 'New Article like'
			});

			// Mock Article like in scope
			scope.articleLike = sampleArticleLikePutData;

			// Set PUT response
			$httpBackend.expectPUT(/article-likes\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/article-likes/' + sampleArticleLikePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid articleLikeId and remove the Article like from the scope', inject(function(ArticleLikes) {
			// Create new Article like object
			var sampleArticleLike = new ArticleLikes({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Article likes array and include the Article like
			scope.articleLikes = [sampleArticleLike];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/article-likes\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleArticleLike);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.articleLikes.length).toBe(0);
		}));
	});
}());