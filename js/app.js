var app = angular.module('app', []).
  component('menu', {
	templateUrl: 'templates/menu.html',
	controller: function($scope) {
	  $scope.hej = 'Hej';
	  $scope.title = 'I like trains.'
	}
  });

