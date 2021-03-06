'use strict';

//Offers service used to communicate Offers REST endpoints
angular.module('offers').factory('Offers', ['$resource',
	function($resource) {
		return $resource('offers/:offerId', { offerId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);