// ==== IMPORTS ====
const assert 						= require('assert');
const http							= require('http');
const supertest						= require('supertest');
const server 						= require('../main');
const any							= require('promise.any');



// ==== TESTS ====
setTimeout(function () {

	const ROOT = `http://localhost:${3000}/botgame`;
	const GROUP_ID = 'DEMO';
	const GROUP_ID_2 = 'DEMO_2';

	const agent = supertest.agent(server);


	describe('main server', function () {

		it('should return a positive state message', function (done) {
			agent
				.get('/state')
				.expect(200, 'Online', done);
		});
	});

	describe('botgame server', function () {

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

		it('should be a valid first turn in a botgame', function (done) {
			agent
				.post('/botgame/join')
				.query(`groupid=${GROUP_ID}`)
				.then(res => {

					const resBody = res.body;
					const { id, activePlayer, turnResult } = resBody;

					const turn = {};

					if(turnResult === null) {
						turn.toId = 0;
					}

					if(turnResult !== null) {
						turnResult.field.forEach(e => {
							if(e.token === 0) {
								turn.toId = e.id;
							}
						});
					}

					return agent
							.post('/botgame/join')
							.query(`groupid=${GROUP_ID}`)
							.query(`gameid=${id}`)
							.send(turn)
				})
				.then(null, err => {
					done(new Error('Joining the game failed.'));
				})
				.then(turnRes => {
					done();
				})
				.then(null, err => {
					done(new Error('Sending turn after joining failed.'));
				})
        });


        it('should be a valid first turn in a botgame, not  a winning turn', function (done) {
            agent
                .post('/botgame/join')
                .query(`groupid=${GROUP_ID}`)
                .then(res => {

                    const resBody                        = res.body;
                    const {id, activePlayer, turnResult} = resBody;

                    const turn = {};

                    if (turnResult === null) {
                        turn.toId = 23;
                    }

                    if (turnResult !== null) {
                        throw new Error('Bot has made the first turn.');
                    }

                    return agent
                        .post('/botgame/join')
                        .query(`groupid=${GROUP_ID}`)
                        .query(`gameid=${id}`)
                        .send(turn)
                })
                .then(null, err => {
                    throw err;
                })
                .then(turnRes => {
                    if (turnRes.body.statusCode !== 100) {
                        throw new Error('Game has ended after first turn.');
                    }
                    done();
                })
                .then(null, err => {
                    done(err);
                })
        })



	});


    describe('versus server', function () {

        it('should allow us to offer and join a game with two clients');

    });


    run();

}, 1000);


/*
 , function (done) {

 agent
 .post('/versus/offer')
 .query(`groupid=${GROUP_ID}`)
 .then(res => {
 const { gameId } = res.body;

 return Promise.resolve(any([
 joinGame(GROUP_ID, gameId),
 joinGame(GROUP_ID_2, gameId)
 ]));
 })
 .then(anyRes => {
 console.dir(anyRes);
 done();
 })
 .catch(null, err => {
 done(new Error('Undefined error occurred testing versus game.'));
 });


 function joinGame (groupId, gameId) {
 return new Promise((resolve, reject) => {
 agent
 .post('/versus/join')
 .query(`groupid=${groupId}`)
 .query(`gameid=${gameId}`)
 .then((err, res) => {
 if(err) {
 return reject(err);
 }
 resolve(res);
 })
 });
 }
 }
 */