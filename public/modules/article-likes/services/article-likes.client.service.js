'use strict';

//Article likes service used to communicate Article likes REST endpoints
angular.module('article-likes').factory('ArticleLikes', ['$resource',
	function($resource) {
		return $resource('article-likes/:articleLikeId', { articleLikeId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);