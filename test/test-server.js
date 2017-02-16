// ==== IMPORTS ====
const assert 						= require('assert');
const http							= require('http');
const supertest						= require('supertest');
const server 						= require('../main');



// ==== TESTS ====
setTimeout(function () {

	const ROOT = `http://localhost:${3000}/botgame`;
	const GROUP_ID = 'DEMO';

	const agent = supertest.agent(server);


	describe('main server', function () {

		it('should return a positive status message', function (done) {
			agent
				.get('/status')
				.expect(200, done);
		});
	});

	describe('botgame', function () {

		it('should allow us to join a botgame', function (done) {
			agent
				.post('/botgame/join')
				.query(`groupid=${GROUP_ID}`)
				.expect(200, done);
		});


		it('should decline us joining a botgame', function (done) {
			agent
				.post('/botgame/join')
				.expect(400, done);
		});


		it('should  decline us joining a botgame', function (done) {
			agent
				.post('/botgame/join')
				.query(`groupid=`)
				.expect(400, done);
		});

	});


	run();

}, 1000);