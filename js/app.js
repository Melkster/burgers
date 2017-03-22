var app = angular.module('app', ['ngMaterial', 'ngRoute']);

app.config(['$routeProvider',
  function($routeProvider) {
	$routeProvider.
	  when('/bar', {
		templateUrl: 'templates/bar.html',
		controller: 'bar-controller'
	  })
	  .when('/kitchen', {
		templateUrl: 'templates/kitchen.html',
		controller: 'kitchen-controller'
	  })
	  .otherwise ({
		redirectTo :'/bar'
	});
  }]);

app.controller('bar-controller', function($scope, $mdDialog, orderService) {
  $scope.burgers = burgers;
  $scope.favorites = favorites;
  $scope.drinks = drinks;
  $scope.order = [];
  $scope.zoneChosen = '-';
  $scope.zoneChosenBool = false;
  $scope.ingredients = ["bacon", "lettuce", "bread", "onion", "ketchup", "bbq-sauce", "cheese"];
  $scope.showCustomize = false;
  $scope.noCustoms = {'removed': [], 'comment': undefined};

  $scope.setZone = function(zone) {
      $scope.zoneChosen = zone;
      $scope.zoneChosenBool = false;
  };

  $scope.addItem = function(item, customs) {
	var itemInOrder = $scope.itemExists($scope.order, item, customs);
	var newItem = {
	  'item': item,
	  'amount': 1,
	  'customs': customs,
	  'time': new Date(),
          'progress': false
	}

	if (itemInOrder === null) $scope.order.push(newItem);
	else itemInOrder.amount++;
	//console.log(newItem);
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

  $scope.itemExists = function(list, item, customs) {
	for (i in list) { 
	  if (
		list[i].item.name == item.name &&                            // name
		list[i].customs.comment == customs.comment &&                // comment
		$scope.equalsArray(list[i].customs.removed, customs.removed) // removed
	  ) return list[i];
	}
	return null;
  };

  $scope.sum = function(order) {
	var sum = 0;
	for (i in order) sum += order[i].item.price*order[i].amount;
	return sum;
  }

  $scope.submitOrder = function() {
      if ($scope.order.length != 0 && Number.isInteger($scope.zoneChosen)){
	  orderService.addOrder({
              'orders': $scope.order,
              'zone': $scope.zoneChosen
          });
	  $scope.clearOrder();
          $scope.zoneChosenBool = false;
      } else if (!Number.isInteger($scope.zoneChosen)) {
          
          $scope.zoneChosenBool = true;
      }
  }

  $scope.clearOrder = function() {
      $scope.order = [];
      $scope.zoneChosen = '-';
      $scope.zoneChosenBool = false;
  }

  $scope.showAdvanced = function(ev, burger) {
	console.log("hej");
	$mdDialog.show({
	  templateUrl: 'templates/dialog.html',
	  controller: 'bar-controller',
	  parent: angular.element(document.body),
	  targetEvent: ev,
	  clickOutsideToClose:true,
	  fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
          
	})
	  .then(function(answer) {
		console.log("hejsan")
		$scope.status = 'You said the information was "' + answer + '".';
		console.log($scope.status);
	  }, function() {
		$scope.status = 'You cancelled the dialog.';
		console.log($scope.status);
	  });
  };

  $scope.addCustom = function(item, removed) {
	var customs = {
	  'removed': removed,
	  'comment': item.comment
	}
	$scope.addItem(item, customs);
	item.customs = [];
  }

  $scope.toggleCustom = function (item, list) {
	var idx = list.indexOf(item);

	if (idx > -1) {
	  list.splice(idx, 1);
	}
	else {
	  list.push(item);
	}
  };

  $scope.customExists = function (item, list) {
	return list.indexOf(item) > -1;
  };

  $scope.equalsArray = function (a, b) {
	if (a === b) return true;
	if (a == null || b == null) return false;
	if (a.length != b.length) return false;

	a.sort();
	b.sort();

	for (var i = 0; i < a.length; ++i) {
	  if (a[i] !== b[i]) return false;
	}
	return true;
}
});

app.controller('kitchen-controller', function($scope, $mdDialog, orderService) {
    $scope.orders = orderService.getOrder();
	//console.log($scope.orders);
    $scope.removeMeal = function(meal) {
        console.log(meal.progress);
        if (!meal.progress) {
            meal.progress = true;
        } else {
            meal.amount--;
            for (var i = 0; i < $scope.orders.length; i++) {
                var order = $scope.orders[i].orders;
                
                if ($scope.orderEmpty(order)) {
                    $scope.orders.splice(i, 1);
                }
            }
        }
    }

    $scope.orderEmpty = function(order) {
        
        for (var i = 0; i < order.length; i++) {
            var meal = order[i];
            
            if (meal.amount != 0) return false;
        }
        return true;
    }

    $scope.range = function(n) {
        var array = []
        for (var i = 1; i <= n; i++) {
            array.push(i);
        }
        
        return array;
    }

    $scope.noOrders = function() {
        return $scope.orders.length == 0;
    }

    $scope.getTime = function(meal) {
        return ('0' + meal.time.getHours()).slice(-2) + ':' +
            ('0' + meal.time.getMinutes()).slice(-2);
        
        
    }
});

app.service('orderService', function() {
    var orders = [];
    
    var addOrder = function(order) {
        order.orders = flatten(order.orders);
        
        for (var i = 0; i < orders.length; i++) {
            if (orders[i].zone == order.zone) {
                for (var j = 0; j < order.orders.length; j++) {
                    orders[i].orders.push(order.orders[j]);
                }
                return;
            }
        }
        orders.push(order);
    }
    
    var getOrder = function() {
	return orders;
    }

    var flatten = function(orders) {
        var new_orders = [];
        for (var i = 0; i < orders.length; i++) {
            for (var j = 0; j < orders[i].amount; j++) {
                new_orders.push({'item': orders[i].item,
                                 'amount': 1,
                                 'customs': orders[i].customs,
                                 'time': orders[i].time,
                                 'progress': false});
            }
        }
        console.log(new_orders);
        return new_orders;
        
    }

    return { // make sure to return all public functions
        addOrder: addOrder,
        getOrder: getOrder
    };
});

//app.controller('customize-controller', function($scope) {
 // $scope.ingredients = ["bacon", "lettuce", "bread", "onion", "ketchup", "bbq-sauce", "cheese"];
//});
