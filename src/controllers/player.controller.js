const playerService = require('../services/player.service');
const catchAsync = require('../utils/catchAsync');


const addPlayers = catchAsync( async( req, res) => {
    const {matchId} = req.params;
    req.body.forEach( player => {
        player.match_id = matchId;
    });
    const playersCreated = await playerService.createPlayers(req.body);
    res.send(playersCreated);
});

const getPlayersByMatch = catchAsync( async( req, res) => {
    const { matchId } = req.params;

    const players = await playerService.getPlayersByFilter({ match_id: matchId});
    res.send(players);
});

module.exports = {
    addPlayers,
    getPlayersByMatch,
};