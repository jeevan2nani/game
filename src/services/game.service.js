const game = require('../models/game.model');
const { getPlayerById } = require('./player.service');
const { getUserByFilter } = require('./user.service');

const createGame = async ( body) => game.create(body);

const getGameById = async ( id) => game.findById(id);

const getGames = async (filter) => game.find(filter);

const updateGame = async(id, body) => game.findOneAndUpdate({_id:id}, body, { new: true});

const joinGame = async ( body, gameId ) => {
    const game = await updateGame(gameId,{ $push: { usersInfo: body.userDetails}} );
    return game;
};

const generateRandomPlayer = async( gameId) => {
    let game = await getGameById(gameId);
    const isUnsold = false;
    const isAllCompleted = false;
    if( game.playersInAuction.length === 0 && game.unsoldPlayers.length === 0 && game.playersAfterUnsoldAuction.length === 0){
        const playersInAuction = game.TeamA.concat(game.TeamB);
        game = await updateGame(game._id, {playersInAuction});
    }
    if( game.playersInAuction.length === 0) isUnsold = true;
    else if (game.unsoldPlayers.length === 0) isAllCompleted = true;
    if( isAllCompleted === true) return null;
    const allPlayers = (isUnsold === true)? game.unsoldPlayers: game.playersInAuction;
    const index = Math.floor( Math.random()* allPlayers.length);
    console.log(index);
    const player = await getPlayerById(allPlayers[index]);
    await game.findOneAndUpdate({_id: gameId}, { $push: { activity: `Bidding for ${player.name} is started`} });
    return {player, isUnsold};
};

const calculateBidWinner = async ( gameId, playerId, isUnsold ) => {
    const game = await getGameById(gameId);
    const userBiddingsForPlayer = game.playerBidDetails[`${playerId}`];
    const playerDetails = await getPlayerById(playerId);
    let winnerId;
    let maxBid = -1;
    let index = -1;
    let i =0;
    for(user of userBiddingsForPlayer){
        if(user.bid > maxBid){
            winnerId = user.userId;
            maxBid = user.bid;
            index = i;
        }
        i++;
    }
    let filter;
    let activity;
    if( maxBid === -1){
        activity =  `${playerDetails.name} is Unsold`;
        filter = { $pull: {playerBidDetails: playerId}, $push: { unsoldPlayers: playerId} }
        if(isUnsold === true ) filter = { $pull: {unsoldPlayers: playerId}, $push: { playersAfterUnsoldAuction: playerId, activity} }
    }else{
        const isMaxBoolean = (game.usersInfo[index].playersBrought.length + 1) === 6? true: false;
        const balanceAmount = game.usersInfo[index].balanceAmount - maxBid;
        const userDetails = await getUserByFilter({_id: game.usersInfo[index].userId });
        activity = `${playerDetails.name} is bought by ${user.name}`;
        filter = { $pull: { playerBidDetails: playerId } ,
            $push: { [`usersInfo.${index}.playersBought`]: playerId, activity }, 
            $set: { [`usersInfo.${index}.isMaxPlayers`]: isMaxBoolean, [`usersInfo.${index}.balanceAmount`]: balanceAmount } };
        
        if( isUnsold === true ){
            filter = { $pull: { unsoldPlayers: playerId } ,
            $push: { [`usersInfo.${index}.playersBought`]: playerId , activity}, 
            $set: { [`usersInfo.${index}.isMaxPlayers`]: isMaxBoolean, [`usersInfo.${index}.balanceAmount`]: balanceAmount } };
        }
    }
    const updateGame = await this.updateGame(gameId, filter);
    return activity;
}

module.exports = {
    createGame,
    getGameById,
    getGames,
    joinGame,
    updateGame,
    generateRandomPlayer,
    calculateBidWinner,
};