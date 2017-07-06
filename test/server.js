'use strict';

const Lab = require('lab');
const Code = require('code');

const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;

const server = require('../server');

describe('Example Server', () => {
    it('GET /docs', (done) => {
        server.inject('/docs', (res) => {
            expect(res.statusCode).to.equal(200);
            done();
        })
    });

    it('GET /junk', (done) => {
        server.inject('/junk', (res) => {
            expect(res.statusCode).to.equal(404);
            expect(res.result).to.deep.equal({statusCode: 404, error: 'Not Found'});
            done();
        })
    });

    describe('/repo endpoints', () => {
        describe('GET /slugs', () => {
            it('handle naked request', (done) => {
                server.inject('/slugs', (res) => {
                    expect(res.statusCode).to.equal(200);
                    expect(res.result[0]).to.deep.equal({user: 'argonlaser', repo: 'test1'});
                    done();
                })
            });

            it('handle request with param repo', (done) => {
                server.inject('/slugs?repo=test1', (res) => {
                    expect(res.statusCode).to.equal(200);
                    expect(res.result[0]).to.deep.equal({user: 'argonlaser', repo: 'test1'});
                    done();
                })
            });


        });

        function testFor(user, value, callback) {
            server.inject('/slugs/' + user, (res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.result).to.deep.equal(value);
                callback();
            })
        }

        describe('POST /github/user/repo', () => {
            it('handle correct input', (done) => {
                server.inject({url: '/github/vaz/vaztest' , method: 'POST', payload: {}}, (res) => {
                    expect(res.statusCode).to.equal(201);

                    testFor('vaz', {user: 'vaz', repo: 'vaztest'}, done);
                });
            });


        });

    });


});
