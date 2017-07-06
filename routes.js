'use strict';

const Joi = require('joi');

let internals = {};

internals.getslugs = function (request, reply) {

    if (request.query.repo) {
        return reply(internals.findslugs(request.query.repo));
    }
    reply(internals.slugs);
}

internals.findslugs = function (repo) {

    return internals.slugs.filter((slug) => {

        return slug.repo.toLowerCase() === repo.toLowerCase();
    });
}

internals.getslug = function (request, reply) {

    const filtered = internals.slugs.filter((slug) => {
        return slug.user === request.params.user;
    }).pop();

    reply(filtered);
}

internals.addslug = function (request, reply) {

    const slug = {
        user: internals.slugs[internals.slugs.length - 1].user + 1,
        repo: request.payload.repo
    };

    internals.slugs.push(slug);

    reply(slug).created('/slugs/' + slug.user);
}


/*
 * Route - /github/' + slug.user + '/' + slug.repo
 * API - getBadgeLinks
*/
internals.getBadgeLinks = function (request, reply) {

    const slug = {
        user: request.params.user,
        repo: request.params.repo
    };

    internals.slugs.push(slug);

    reply(slug).created('/github/' + slug.user + '/' + slug.repo);
}
module.exports = [{
    method: 'GET',
    path: '/slugs',
    config: {
        validate: {
            query: {
                repo: Joi.string()
            }
        },
        handler: internals.getslugs
    }
}, {
    method: 'GET',
    path: '/slugs/{user}',
    handler: internals.getslug
}, {
    method: 'POST',
    path: '/slugs',
    config: {
        validate: {
            payload: { repo: Joi.string().required().min(3) }
        },
        handler: internals.addslug
    }
}, {
    method: 'POST',
    path: '/github/{user}/{repo}',
    config: {
        handler: internals.getBadgeLinks
    }
}];

internals.slugs = [
    {
        user: 'argonlaser',
        repo: 'test1'
    },
    {
        user: 'scripnull',
        repo: 'test2'
    }
];
