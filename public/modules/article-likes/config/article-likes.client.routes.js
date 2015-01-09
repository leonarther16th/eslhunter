'use strict';

//Setting up route
angular.module('article-likes').config(['$stateProvider',
	function($stateProvider) {
		// Article likes state routing
		$stateProvider.
		state('listArticleLikes', {
			url: '/article-likes',
			templateUrl: 'modules/article-likes/views/list-article-likes.client.view.html'
		}).
		state('createArticleLike', {
			url: '/article-likes/create',
			templateUrl: 'modules/article-likes/views/create-article-like.client.view.html'
		}).
		state('viewArticleLike', {
			url: '/article-likes/:articleLikeId',
			templateUrl: 'modules/article-likes/views/view-article-like.client.view.html'
		}).
		state('editArticleLike', {
			url: '/article-likes/:articleLikeId/edit',
			templateUrl: 'modules/article-likes/views/edit-article-like.client.view.html'
		});
	}
]);