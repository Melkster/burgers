var app = angular.module('app', ['ngMaterial']);

app.component('bar', {
	templateUrl: 'templates/bar.html',
    controller: function($scope, $mdDialog) {
	  $scope.burgers = burgers;
	  $scope.order = [];
	  $scope.zoneChosen = '-';
        

	  $scope.setZone = function(zone) {
	      $scope.zoneChosen = zone;
	  };
	  $scope.addItem = function(item, customs) {
		var itemInOrder = $scope.itemExists($scope.order, item);
		var newItem = {
		  'item': item,
		  'amount': 1,
		  'customs': customs
		}

		if (itemInOrder === null) $scope.order.push(newItem);
		else itemInOrder.amount++;
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

	  $scope.incrementItem = function(orderItem) {
		orderItem.amount ++;
	  }

	  $scope.itemExists = function(list, item) {
		for (i in list) if (angular.equals(list[i].item.name, item.name)) return list[i];
		return null;
	  };

	  $scope.sum = function(order) {
		var sum = 0;
		for (i in order) sum += order[i].item.price*order[i].amount;
		return sum;
	  }

	  $scope.submitOrder = function() {
		if ($scope.order.length != 0){
		  console.log($scope.order);
		  $scope.clearOrder();
		}
	  }

	  $scope.clearOrder = function() {
		$scope.order = [];
	  }

	  //$scope.getItem = function(itemName, items) {
		//for (i in items) if (items[i].name == itemName) {
		  //return items[i];
		//}
	  //}
	$scope.showAdvanced = function(ev) {
            console.log("hej");
            $mdDialog.show({
                templateUrl: 'templates/dialog.html',
                controller: 'customize-controller',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
                fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
            })
                .then(function(answer) {
                    $scope.status = 'You said the information was "' + answer + '".';
                }, function() {
                    $scope.status = 'You cancelled the dialog.';
                });
        };

        //Dialog things

        
    }
});

app.controller('customize-controller', function($scope) {
    $scope.ingredients = ["bacon", "lettuce", "bread", "onion", "ketchup", "bbq-sauce", "cheese"];
});
