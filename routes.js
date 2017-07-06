'use strict';

const Joi = require('joi');

let internals = {};

internals.serveHomePage = function(request, reply) {
    reply.file('views/home.html');
}

internals.serveResultPage = function(request, reply) {
    var repoName = request.params.repoName;

    // user repoName to do all computations
    console.log(repoName);

    reply.file('views/result.html')
}   

module.exports = [
    {
        method: 'GET',
        path: '/',
        handler: internals.serveHomePage
    },
    {
        method: 'GET',
        path: '/{repoName*}',
        handler: internals.serveResultPage
    }
];
