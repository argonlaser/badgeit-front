const Lab = require('lab');
const Code = require('code');

const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;

const server = require('../server');

describe('Example Server', () => {

    it('GET /junk', (done) => {
        server.inject('/junk', (res) => {
            expect(res.statusCode).to.equal(404);
            expect(res.result).to.deep.equal({statusCode: 404, error: 'Not Found'});
            done();
        })
    });

    describe('/', () => {
        describe('GET /', () => {
            it('handle root request', (done) => {
                server.inject('/', (res) => {
                    expect(res.statusCode).to.equal(200);
                    done();
                })
            });

            it('handle favicon request', (done) => {
                server.inject('/favicon.ico', (res) => {
                    expect(res.statusCode).to.equal(200);
                    done();
                })
            });

            it('handle result page', (done) => {
                server.inject('/w/repoUrl', (res) => {
                    expect(res.statusCode).to.equal(200);
                    done();
                })
            });


        });

        describe('POST /callback', () => {
            it('handle callback', (done) => {
                server.inject({url: '/callback', method: 'POST', payload: {reqData: 'Hello World'}}, (res) => {
                    expect(res.statusCode).to.equal(200);
                    done();
                });
            });

        });

    });


});
