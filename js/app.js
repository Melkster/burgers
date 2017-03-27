var socket = io();
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
  $scope.order = [];
  $scope.zoneChosen = '-';
  $scope.zoneChosenBool = false;
  $scope.ingredients = ["bacon", "lettuce", "bread", "onion", "ketchup", "bbq-sauce", "cheese"];
  $scope.showCustomize = false;
  $scope.noCustoms = {'removed': [], 'comment': ""};

  $scope.setZone = function(zone) {
	$scope.zoneChosen = zone;
	$scope.zoneChosenBool = false;
  };

  $scope.addItem = function(item) {
	if (item.customs == undefined || item.customs == "") item.customs = $scope.noCustoms;
	else if (item.customs.comment == undefined) item.customs.comment = "";
	var itemInOrder = $scope.itemExists($scope.order, item);
	var tempItem;
	angular.copy(item, tempItem);

	var newItem = {
	  'item': angular.copy(item),
	  'amount': 1,
	  'time': $scope.getTime(new Date()),
	  'progress': false
	}

	if (itemInOrder === null) $scope.order.push(newItem);
	else itemInOrder.amount++;
  };

  $scope.getTime = function(date) {
	return temp = ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2);
  }

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
	for (i in list) { 
	  if (
		list[i].item.name == item.name &&                                      // name
		list[i].item.customs.comment == item.customs.comment &&                // comment
		$scope.equalsArray(list[i].item.customs.removed, item.customs.removed) // removed
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
	  socket.emit("order", {
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

  $scope.addCustom = function(item, customs) {
	item.customs = customs;
	$scope.addItem(item);
	item.customs.removed = [];
	item.customs.comment = "";
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
	if (list.length == 0) return false;
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
  var testOrder1 = {
	orders: [
	  {
		amount: 1,
		item: {
		  name: "Burger name",
		  customs: {
			removed: ["cheese", "bacon"],
			comment: "comment"
		  },
		},
		progress: false,
		time: "20:15"
	  },
	  {
		amount: 1,
		item: {
		  name: "Anouther burger",
		  customs: {
			removed: ["onion"],
			comment: "another comment"
		  },
		},
		progress: false,
		time: "20:20"
	  }
	],
	zone: 1,
  }
  var testOrder2 = {
	orders: [
	  {
		amount: 1,
		item: {
		  name: "Burger",
		  customs: {
		  },
		},
		progress: false,
		time: "20:15"
	  },
	  {
		amount: 1,
		item: {
		  name: "Anouther burger",
		  customs: {
			removed: [],
			comment: "Comment comment"
		  },
		},
		progress: false,
		time: "20:31"
	  }
	],
	zone: 1,
  }
  $scope.orders.push(testOrder1, testOrder2);

  $scope.removeMeal = function(meal) {
	//console.log(meal.progress);
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

  socket.on("newOrder", function(o) {
	orderService.addOrder(o);
	$scope.$apply();
  })
});

app.service('orderService', function() {
  this.orderData = {orders:[]};

  this.addOrder = function(order) {
	order.orders = flatten(order.orders);

	for (var i = 0; i < this.orderData.orders.length; i++) {
	  if (this.orderData.orders[i].zone == order.zone) {
		for (var j = 0; j < order.orders.length; j++) {
		  this.orderData.orders[i].push(order.orders[j]);
		}
		return;
	  }
	}
	this.orderData.orders.push(order);
  }

  this.getOrder = function() {
	return this.orderData.orders;
  }

  var flatten = function(orders) {
	var new_orders = [];
	for (var i = 0; i < orders.length; i++) {
	  for (var j = 0; j < orders[i].amount; j++) {
		new_orders.push({'item': orders[i].item,
		  'amount': 1,
		  'time': orders[i].time,
		  'progress': false});
	  }
	}
	//console.log(new_orders);
	return new_orders;
  }

});

//app.controller('customize-controller', function($scope) {
// $scope.ingredients = ["bacon", "lettuce", "bread", "onion", "ketchup", "bbq-sauce", "cheese"];
//});
