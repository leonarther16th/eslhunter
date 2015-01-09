'use strict';

angular.module('articles').controller('ArticlesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Articles', 'Asked', 'Search', 'ArticleAnswers', 'Answers', 'UserStats',
	function($scope, $stateParams, $location, Authentication, Articles, Asked, Search, ArticleAnswers, Answers, UserStats) {
		$scope.authentication = Authentication;

		$scope.create = function() {
			var article = new Articles({
				title: this.title,
				content: this.content
			});
			article.$save(function(response) {
				$location.path('articles');

				$scope.title = '';
				$scope.content = '';
				$scope.articles = Articles.query(function(){
				$scope.count = $scope.articles.length;
			});

				$scope.user_stats.articles_count += 1;
				
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.remove = function(article) {
			if (article) {
				article.$remove();

				for (var i in $scope.articles) {
					if ($scope.articles[i] === article) {
						$scope.articles.splice(i, 1);
					}
				}
			} else {
				$scope.article.$remove(function() {
					$location.path('articles');
				});
			}
		};

		$scope.update = function() {
			var article = $scope.article;
			

			article.$update(function() {
				$location.path('articles/' + article._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.articles = Articles.query(function(){
				$scope.count = $scope.articles.length;
			});

			var articles = Asked.get(function(){
				$scope.count = articles.length;
			});


			//getting stats

			$scope.user_stats = UserStats.get();

			//Articles.count({}, function(err, c){
			//	$scope.count = c;
			//});
			
			
			/*
			$interval(function(){
				console.log('Outside here');
				var articles = Articles.query();
				if ($scope.articles !== articles){
					console.log('Inside here');
					$scope.articles = articles;
				}
				
			}, 1000);
			*/
			};
			
		$scope.findByUser = function() {
			/*$scope.userArticles = Articles.query( function(){
				$scope.count2 = $scope.userArticles.length;
			});
			Articles.find({'title': 'dsfsdf'}, function(err, docs){
				$scope.articles = docs;
				console.log($scope.articles);
			});*/
			$scope.articles = Asked.get(function(){
				$scope.count = $scope.articles.length;
			});
			console.log('I was clicked');
		};

		$scope.go = function (path) {
		  $location.path( path );
		};

		$scope.search = function(){

			$scope.articles = Search.get({
				searchText: $stateParams.searchText});
			//$scope.findByUser();
			//$scope.articles = [];
			
		};


		$scope.createAnswer = function() {
			// Create new Answer object
			var answer = new Answers ({
				content: this.content,
				article_id: $scope.article._id
			});

			// Redirect after save
			answer.$save(function(response) {
				//$location.path('answers/' + response._id);

				// Clear form fields
				$scope.content = '';
				$scope.answers = ArticleAnswers.get({
				articleId: $stateParams.articleId
			});
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
		

		$scope.findOne = function() {
			$scope.article = Articles.get({
				articleId: $stateParams.articleId
			});

			$scope.answers = ArticleAnswers.get({
				articleId: $stateParams.articleId
			});
		};
	}
]);
