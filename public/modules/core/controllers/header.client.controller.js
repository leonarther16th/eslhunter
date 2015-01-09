'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus', 
	function($scope, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
			
		};

		$scope.search = function() {
			$scope.seach = 'Hello';
		};


		// $scope.search = function() {
		// 	$scope.searchText = '';
		// 	$scope.articles = Search.get(function(){
		// 		//searchText: $scope.searchText;
		// 	});
			
		// };

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);
