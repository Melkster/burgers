var app = angular.module('app', []);

app.component('bar', {
	templateUrl: 'templates/bar.html',
	controller: function($scope) {
	  $scope.hej = 'Hej';
	  $scope.title = 'I like trains.';
	  $scope.burgers = burgers;
	}
  });
