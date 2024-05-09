const mongoose = require('mongoose');
const { v4 } = require('uuid');

const userInGame = {
    userId: { type : String, refs: 'User'},
    totalAmount: Number,
    balanceAmount: Number,
    playersBrought: [ {type: String, ref: 'players'}],
    isMaxPlayers: Boolean,
    totalPoints: Number,
    _id: false,
};

const gameSchema = new mongoose.Schema({
    _id: {
        type: String,
        default(){
            return `game_${v4()}`;
        }
    },
    match_id: { type: String, ref: 'match'},
    gameCost: Number,
    TeamA: [ {type: String, ref: 'players'} ],
    TeamB: [{type: String, ref: 'players'} ],
    playersInAuction: [{type:String, ref:'players'}],
    playersAfterUnsoldAuction: [{type:String, ref:'players'}],
    gameStartTime: Date,
    usersInfo: [ userInGame ],
    maxPlayersForUsers: { type: Number, default: 6},
    playerBidDetails: Object,
    unsoldPlayers: [ {type: String, ref: 'players'} ],
    activity: [ {type: String}],
},{
    timestamps: true,
});

const game = mongoose.model('game',gameSchema);

module.exports = game;