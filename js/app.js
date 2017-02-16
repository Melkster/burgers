var app = angular.module('app', []).
  component('bar', {
	templateUrl: 'templates/bar.html',
	controller: function($scope) {
	  $scope.hej = 'Hej';
	  $scope.title = 'I like trains.';
	  $scope.burgers = burgers;
	  $scope.getBurgerNames = function(burgers) {
		names = [];
		for (b in burgers) names.push(burgers[b].name);
		return names;
	  };
	}
  });
