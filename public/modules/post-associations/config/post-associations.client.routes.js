'use strict';

//Setting up route
angular.module('post-associations').config(['$stateProvider',
	function($stateProvider) {
		// Post associations state routing
		$stateProvider.
		state('listPostAssociations', {
			url: '/post-associations',
			templateUrl: 'modules/articles/views/list-articles.client.view.html'
		}).
		state('createPostAssociation', {
			url: '/post-associations/create',
			templateUrl: 'modules/post-associations/views/create-post-association.client.view.html'
		}).
		state('viewPostAssociation', {
			url: '/post-associations/:postAssociationId',
			templateUrl: 'modules/post-associations/views/view-post-association.client.view.html'
		}).
		state('editPostAssociation', {
			url: '/post-associations/:postAssociationId/edit',
			templateUrl: 'modules/post-associations/views/edit-post-association.client.view.html'
		});
	}
]);
