'use strict';

angular.module('articles').directive('editable', ['$document',
	function($document) {
		return {
			template: '<div></div>',
			restrict: 'E',
			link: function postLink(scope, element, attrs) {
				// Editable directive logic
				// ...
				console.log(element);
				element.text('this is the editable directive');
			}
		};
	}
]);


