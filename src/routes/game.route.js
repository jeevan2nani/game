const express = require('express');
const gameController = require('../controllers/game.controller');

const router = express.Router();

router
 .route('/:matchId')
 .post(gameController.createGame)
 .get(gameController.getGames);

router
 .route('/:matchId/:id')
 .get(gameController.getGameById)

router
 .route('/:matchId/:id/join')
 .post(gameController.joinGame);

router
 .route('/:matchId/:id/:playerId/bid')
 .post(gameController.placeBid)

module.exports = router;