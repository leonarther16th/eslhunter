'use strict';

(function() {
	// Post associations Controller Spec
	describe('Post associations Controller Tests', function() {
		// Initialize global variables
		var PostAssociationsController,
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

			// Initialize the Post associations controller.
			PostAssociationsController = $controller('PostAssociationsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Post association object fetched from XHR', inject(function(PostAssociations) {
			// Create sample Post association using the Post associations service
			var samplePostAssociation = new PostAssociations({
				name: 'New Post association'
			});

			// Create a sample Post associations array that includes the new Post association
			var samplePostAssociations = [samplePostAssociation];

			// Set GET response
			$httpBackend.expectGET('post-associations').respond(samplePostAssociations);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.postAssociations).toEqualData(samplePostAssociations);
		}));

		it('$scope.findOne() should create an array with one Post association object fetched from XHR using a postAssociationId URL parameter', inject(function(PostAssociations) {
			// Define a sample Post association object
			var samplePostAssociation = new PostAssociations({
				name: 'New Post association'
			});

			// Set the URL parameter
			$stateParams.postAssociationId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/post-associations\/([0-9a-fA-F]{24})$/).respond(samplePostAssociation);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.postAssociation).toEqualData(samplePostAssociation);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(PostAssociations) {
			// Create a sample Post association object
			var samplePostAssociationPostData = new PostAssociations({
				name: 'New Post association'
			});

			// Create a sample Post association response
			var samplePostAssociationResponse = new PostAssociations({
				_id: '525cf20451979dea2c000001',
				name: 'New Post association'
			});

			// Fixture mock form input values
			scope.name = 'New Post association';

			// Set POST response
			$httpBackend.expectPOST('post-associations', samplePostAssociationPostData).respond(samplePostAssociationResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Post association was created
			expect($location.path()).toBe('/post-associations/' + samplePostAssociationResponse._id);
		}));

		it('$scope.update() should update a valid Post association', inject(function(PostAssociations) {
			// Define a sample Post association put data
			var samplePostAssociationPutData = new PostAssociations({
				_id: '525cf20451979dea2c000001',
				name: 'New Post association'
			});

			// Mock Post association in scope
			scope.postAssociation = samplePostAssociationPutData;

			// Set PUT response
			$httpBackend.expectPUT(/post-associations\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/post-associations/' + samplePostAssociationPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid postAssociationId and remove the Post association from the scope', inject(function(PostAssociations) {
			// Create new Post association object
			var samplePostAssociation = new PostAssociations({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Post associations array and include the Post association
			scope.postAssociations = [samplePostAssociation];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/post-associations\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePostAssociation);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.postAssociations.length).toBe(0);
		}));
	});
}());