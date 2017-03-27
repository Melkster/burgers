/* jslint node: true */
'use strict';

// Require express, socket.io, and vue
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

// Pick arbitrary port
var port = 3000;
app.set('port', (process.env.PORT || port));

// Language should be user specific but default is set here
var lang = "sv";

// Store orders in a an anonymous class for now. 
var orders = function() {
  var orders = {};

  var addOrder = function(dish) {
    orders[dish.orderId] ={};
    orders[dish.orderId].orderItems = dish.orderItems;
    orders[dish.orderId].done = false;
  };

  var getAll = function() {
    return orders;
  };

  var markDone = function(orderId) {
    orders[orderId].done = true;
  };

  //expose functions
  return {
    addOrder : addOrder,
    getAll : getAll,
    markDone : markDone
  };
}(); // instantiate the class immediately

app.use('/node_modules', express.static(path.join(__dirname, '/node_modules/')));
app.use('/styling', express.static(path.join(__dirname, '/styling/')));
app.use('/data', express.static(path.join(__dirname, '/data/')));
app.use('/js', express.static(path.join(__dirname, '/js/')));
app.use('/images', express.static(path.join(__dirname, '/images/')));
app.use('/templates', express.static(path.join(__dirname, '/templates/')));

// Serve static assets from public/
// Serve vue from vue/ directory

// Serve diner.html as root page
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', function(socket) {
  // When someone orders something
  socket.on('order', function(dish) {
    //orders.addOrder(dish);
    io.emit('newOrder', dish);
  });

  socket.on('orderDone', function(orderId) {
    orders.markDone(orderId);
    io.emit('currentQueue', orders.getAll());
  });
});

http.listen(app.get('port'), function() {
  console.log('Server listening on port ' + app.get('port'));
});
