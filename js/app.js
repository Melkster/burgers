var app = angular.module('app', []).
  component('bar', {
	templateUrl: 'templates/bar.html',
	controller: function($scope) {
	  $scope.hej = 'Hej';
	  $scope.title = 'I like trains.';
	  $scope.getNames = function(burgers){
		console.log("hej");
		return burgers;
	  };
	}
  });

//function getBurgerNames(burgers) {
  //names = [];
  //for b in burgers names.push(burgers[b].name);
  //return names;
//}

var brgs = [
  {'name': 'b1'}
]
