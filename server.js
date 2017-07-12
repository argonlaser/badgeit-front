'use strict';

const Hapi = require('hapi');
const Inert = require('inert');
const Vision = require('vision');
const Routes = require('./routes');

const config = {};
const server = new Hapi.Server(config);

const port = 8080;
const host = '0.0.0.0' || 'localhost';

server.connection({ port: port, host: host });
const io = require('socket.io')(server.listener);
server.register([Vision, Inert], function(err) {

    if (err) {
        console.error('Failed loading plugins');
        process.exit(1);
    }

    server.route(Routes);

    server.start(function () {
        console.log('Server running at:', server.info.uri);
    });
});


global.io = io;

module.exports = server;
