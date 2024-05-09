const express = require('express');
const playerController = require('../controllers/player.controller');

const router = express.Router();

router
 .route('/:matchId/')
 .post(playerController.addPlayers)
 .get(playerController.getPlayersByMatch);

module.exports = router;