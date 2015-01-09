'use strict';

//Articles service used for communicating with the articles REST endpoints
var articleMadual = angular.module('articles');

articleMadual.factory('Articles', ['$resource',
	function($resource) {
		return $resource('articles/:articleId', {
			articleId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

articleMadual.factory('Asked', ['$resource',
	function($resource) {
		return $resource('asked', {search: 'some'}, {
			get: {
				method: 'GET',
				isArray: true
			}
		});
	}
]);


articleMadual.factory('Search', ['$resource',
	function($resource) {
		return $resource('search', {searchText: '@searchText'}, {
			get: {
				method: 'GET',
				isArray: true
			}
		});
	}
]);


articleMadual.factory('ArticleAnswers', ['$resource',
	function($resource) {
		return $resource('answers-by-article-id', {articleId: '@articleId'}, {
			get: {
				method: 'GET',
				isArray: true
			}
		});
	}
]);


articleMadual.factory('UserStats', ['$resource',
	function($resource) {
		return $resource('stats', {}, {
			get: {
				method: 'GET',
				isArray: false
			}
		});
	}
]);

// articleMadual.factory('Asked', ['$resource',
// 	function($resource) {
// 		return $resource('asked', {search: 'some'});
// 	}
// ]);
