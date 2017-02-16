var app = angular.module('app', []);

app.component('bar', {
	templateUrl: 'templates/bar.html',
	controller: function($scope) {
	  $scope.burgers = burgers;
	  $scope.order = [];
	  $scope.addItem = function(item) {
		var itemInList = $scope.itemExists($scope.order, item);
		var newItem = {
		  'item': item,
		  'amount': 1
		}

		if (itemInList === null) $scope.order.push(newItem);
		else {
		  itemInList.amount++;
		}
	  };

	  $scope.itemExists = function(list, item) {
		for (i in list) if (angular.equals(list[i].item.name, item.name)) return list[i];
		return null;
	  };
	}
});
