#!/usr/bin/env node

var Hapi = require('hapi');
var server = new Hapi.Server();

server.connection({port: 3000});

server.route({
    method: 'GET',
    path: '/{yourname*}',
    handler: function(req, reply) {
        reply('Hello ' + req.params.yourname + '!')
    }
});

server.start(function(){ // boots your server
    console.log('Now Visit: http://localhost:3000/YOURNAME')
});

module.exports = server;
