'use strict';

angular.module('articles').directive('searchable', [
	function() {
		return {
			replace: true,
			restrict: 'E',
			scope: false,
			templateUrl: 'modules/articles/views/_search-bar.client.view.html',
			controller: 'ArticlesController',
			
			link: function postLink(element, attrs) {
				// Searchable directive logic
				// ...
				
				//element.text('this is the searchable directive');
			}
		};
	}
]);
