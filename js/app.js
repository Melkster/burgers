var app = angular.module('app', []);

app.component('bar', {
	templateUrl: 'templates/bar.html',
	controller: function($scope) {
	  $scope.burgers = burgers;
	  $scope.order = [];
	  $scope.addItem = function(item) {
		var itemInList = $scope.itemExists($scope.order, item);
		if (itemInList === null) $scope.order.push({ 'name': item, 'amount': 1 });
		else {
		  itemInList.amount++;
		}
	  };

	  $scope.itemExists = function(list, item) {
		for (i in list) if (list[i].item == item) return list[i];
		return null;
	  };
	}
});
