const mongoose = require('mongoose');
const { v4 } = require('uuid');

const playerSchema = new mongoose.Schema({
    _id: {
        type: String,
        default(){
            return `player_${v4()}`;
        },
    },
    name: String,
    teamName: String,
    match_id: String,
    minBids: Number,
    points: Number,
    stats: Object,
},{
    timestamps: true,
});

const players = mongoose.model('players', playerSchema);

module.exports = players;