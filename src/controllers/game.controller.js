const axios = require('axios');
const gameService = require('../services/game.service');
const matchService = require('../services/match.service');
const userService = require('../services/user.service');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const { FORBIDDEN, NOT_FOUND } = require('http-status');
const { createGameStartCountDown } = require('../schedulers/schedule');

const createGame = catchAsync( async( req, res) => {
    const {body} = req.body;
    const { matchId} = req.params;
    const matchDetails = matchService.getMatchByFilter({_id: matchId});
    const currTime = new Date();
    if( matchDetails.matchStartTime < currTime){
        throw new ApiError(FORBIDDEN, 'Match Has been Started');
    }
    const playersInAuction = body.teamA?.concat(body.teamB);
    const game = await gameService.createGame({ ...body, match_id: matchId, playersInAuction});
    res.send(game);
});

const getGameById = catchAsync( async( req, res ) => {
    const { id } = req.params;
    const game = await gameService.getGameById(id);
    res.send(game);
})

const getGames = catchAsync( async( req, res) => {
    const { matchId} = req.params;
    console.log(req.params);
    const games = await gameService.getGames({match_id: matchId});
    res.send(games);
});

const joinGame = catchAsync( async( req, res) => {
    const {matchId,id} = req.params;
    const {body} = req;
    const matchDetails = matchService.getMatchByFilter({_id: matchId});
    const currTime = new Date();
    if( matchDetails.matchStartTime < currTime){
        throw new ApiError(FORBIDDEN, 'Match Has been Started');
    }

    const gameDetails = await gameService.getGameById(id);
    if( gameDetails.usersInfo.length === 4){
        throw new ApiError(FORBIDDEN,'Contest is Full. Join Another contest');
    }
    let isInGame = false;
    if(gameDetails){
        for(let i =0; i< gameDetails.usersInfo.length; i++){
            if(gameDetails.usersInfo[i].userId === req.userId){
                isInGame = true;
                break;
            }
        }
    }
    const user = await userService.getUserByFilter({_id: req.userId});


    if( user.walletAmount < gameDetails.gameCost){
        throw new ApiError(FORBIDDEN, 'In-suficient Balance');
    }
    let game;
    if(isInGame === true) {
        throw new ApiError(FORBIDDEN, 'Already joined in the same Game');
    } else {
        game = await gameService.joinGame( body, id);
    }
    console.log( game.usersInfo.length);
    if(game.usersInfo.length === 4){
        console.log('CHeck In');
        const io = req.app.get('io');
        await createGameStartCountDown(io, id);
    }
    //Retry Count
    // await userService.updateUser(id, { walletAmount: user.walletAmount - gameDetails.gameCost});
    res.send(game);
});

const placeBid = catchAsync( async(req, res) => {
    const {id, playerId } = req.params;
    const game = await gameService.getGameById(id);
    if(!game){
        throw new ApiError(NOT_FOUND,'Game Not Found');
    }
    //Need to Add Logic to keep check for not Allowing user to place multiple bids

    const updatedGame = await gameService.updateGame(id, {$push: {[`playerBidDetails.${playerId}`]: req.body }});
    res.send(updatedGame);
});


module.exports = {
    createGame,
    joinGame,
    getGames,
    getGameById,
    placeBid,
}