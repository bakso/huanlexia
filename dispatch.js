var cluster = require('node-cluster');

var master = cluster.Master();
master.register(80, __dirname + '/app.js').dispatch();