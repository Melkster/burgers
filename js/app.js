var app = angular.module('app', ['ngMaterial']);

app.component('bar', {
	templateUrl: 'templates/bar.html',
	controller: function($scope) {
	  $scope.burgers = burgers;
	  $scope.order = [];
	  $scope.zoneChosen = 0;


	  $scope.setZone = function(zone) {
	      $scope.zoneChosen = zone;
	      console.log(zone);
	  };
	  $scope.addItem = function(item) {
		var itemInList = $scope.itemExists($scope.order, item);
		var newItem = {
		  'item': item,
		  'amount': 1
		}

		if (itemInList === null) $scope.order.push(newItem);
		else itemInList.amount++;
	  };

	  $scope.removeItem = function(item, items) {
		for (i in items) if (angular.equals(items[i].item, item)) {
		  if (items[i].amount > 1) items[i].amount--;
		  else {
			items.splice(i, 1);
			return;
		  }
		}
	  }

	  $scope.itemExists = function(list, item) {
		for (i in list) if (angular.equals(list[i].item.name, item.name)) return list[i];
		return null;
	  };

	  //$scope.getItem = function(itemName, items) {
		//for (i in items) if (items[i].name == itemName) {
		  //return items[i];
		//}
	  //}
	}
});
