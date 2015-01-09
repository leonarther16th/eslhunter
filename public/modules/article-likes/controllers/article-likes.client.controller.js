'use strict';

// Article likes controller
angular.module('article-likes').controller('ArticleLikesController', ['$scope', '$stateParams', '$location', 'Authentication', 'ArticleLikes',
	function($scope, $stateParams, $location, Authentication, ArticleLikes) {
		$scope.authentication = Authentication;

		// Create new Article like
		$scope.create = function() {
			// Create new Article like object
			var articleLike = new ArticleLikes ({
				name: this.name
			});

			// Redirect after save
			articleLike.$save(function(response) {
				$location.path('article-likes/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Article like
		$scope.remove = function(articleLike) {
			if ( articleLike ) { 
				articleLike.$remove();

				for (var i in $scope.articleLikes) {
					if ($scope.articleLikes [i] === articleLike) {
						$scope.articleLikes.splice(i, 1);
					}
				}
			} else {
				$scope.articleLike.$remove(function() {
					$location.path('article-likes');
				});
			}
		};

		// Update existing Article like
		$scope.update = function() {
			var articleLike = $scope.articleLike;

			articleLike.$update(function() {
				$location.path('article-likes/' + articleLike._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Article likes
		$scope.find = function() {
			$scope.articleLikes = ArticleLikes.query();
		};

		// Find existing Article like
		$scope.findOne = function() {
			$scope.articleLike = ArticleLikes.get({ 
				articleLikeId: $stateParams.articleLikeId
			});
		};
	}
]);