const schedule = require('node-schedule');
const socketIo = require('socket.io');
const { generateRandomPlayer, getGameById, calculateBidWinner } = require('../services/game.service');

const biddingCountDown = async( io, gameId, playerId, isUnsold) => {
    let counter = 10;
    const job = schedule.scheduleJob('*/1 * * * * *', async () => {
        if( counter > 0){
            counter--;
            io.emit('biddingCounter',counter);
            const game = await getGameById(gameId);
            if(game.playerBidDetails[`${playerId}`].length === 4){
                job.cancel();
                //Calculate winner and emit message
                const winner = await calculateBidWinner(gameId, playerId, isUnsold);
                io.emit('BidWinner', winner);
                const generatedObj = await generateRandomPlayer(gameId);
                if( generatedObj === null){
                    io.emit('GameStatus', 'Completed');
                } else{
                    const {player, unSold} = generatedObj;
                    io.emit('player', player);
                    console.log(player);
                    biddingCountDown(io,gameId,player._id, unSold);
                }
            }
            console.log('Bidding Counter', counter);
        }else{
            counter--;
            job.cancel();
        }
    });
}

const createGameStartCountDown = async (io, gameId) => {
    let counter = 10;
    const job = schedule.scheduleJob('*/1 * * * * *', async ()=> {
        if( counter > 0){
            counter--;
            io.emit('counter',counter);
            console.log(counter);
        }else{
            counter--;
            job.cancel();
        }
        if(counter === 0){
            const {player, isUnsold } = await generateRandomPlayer(gameId);
            io.emit('player', player);
            console.log(player);
            biddingCountDown(io,gameId,player._id, isUnsold);

        }
    });
};

module.exports = {
    createGameStartCountDown,
    biddingCountDown,
}