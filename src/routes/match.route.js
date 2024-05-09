const express = require('express');
const matchController = require('../controllers/match.controller');

const router = express.Router();

router
 .route('/')
 .post(matchController.createMatch); //Middlwear 

router
 .route('/id')
 .patch(matchController.updateMatch);

module.exports = router;