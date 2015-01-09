'use strict';

// Post associations controller
angular.module('post-associations').controller('PostAssociationsController', ['$scope', '$stateParams', '$location', 'Authentication', 'PostAssociations',
	function($scope, $stateParams, $location, Authentication, PostAssociations) {
		$scope.authentication = Authentication;

		// Create new Post association
		$scope.create = function() {
			// Create new Post association object
			var postAssociation = new PostAssociations ({
				name: this.name
			});

			// Redirect after save
			postAssociation.$save(function(response) {
				$location.path('post-associations/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Post association
		$scope.remove = function(postAssociation) {
			if ( postAssociation ) { 
				postAssociation.$remove();

				for (var i in $scope.postAssociations) {
					if ($scope.postAssociations [i] === postAssociation) {
						$scope.postAssociations.splice(i, 1);
					}
				}
			} else {
				$scope.postAssociation.$remove(function() {
					$location.path('post-associations');
				});
			}
		};

		// Update existing Post association
		$scope.update = function() {
			var postAssociation = $scope.postAssociation;

			postAssociation.$update(function() {
				$location.path('post-associations/' + postAssociation._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Post associations
		$scope.find = function() {
			$scope.postAssociations = PostAssociations.query();
		};

		// Find existing Post association
		$scope.findOne = function() {
			$scope.postAssociation = PostAssociations.get({ 
				postAssociationId: $stateParams.postAssociationId
			});
		};
	}
]);