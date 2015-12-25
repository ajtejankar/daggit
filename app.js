'use strict';

let express = require('express');
let app = express();
let server = require('http').createServer(app);
let io = require('socket.io')(server);
let port = 8080;
let graph = require('./graph');
let WD;

//serve static files
app.use(express.static(__dirname));

io.on('connection', function (socket) {
  console.log('Connection received.');
  graph(WD)
    .then(function(data) {
      console.log('Sending data');
      console.log(data);
      socket.emit('graph', data);
    })
    .catch(function(err) {
      console.log('Something bonked');
      console.log(err);
      socket.emit('bonked', err.message);
    });
});

module.exports = function(dir) {
  WD = dir;
  server.listen(port, function () {
    console.log('Daggit started in the "' + dir + '" directory');
    console.log('Server listening at port %d', port);
  });
};
