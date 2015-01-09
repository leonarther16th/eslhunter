'use strict';

//Post associations service used to communicate Post associations REST endpoints
angular.module('post-associations').factory('PostAssociations', ['$resource',
	function($resource) {
		return $resource('post-associations/:postAssociationId', { postAssociationId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);