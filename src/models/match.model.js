const mongoose = require('mongoose');
const {v4} = require('uuid');

const matchSchema = new mongoose.Schema({
    _id: {
        type: String,
        default(){
            return `match_${v4()}`;
        },
    },
    matchName: String,
    matchStartTime: Date,
    createdBy: {
        type: String,
        ref: 'User',
    },
    updatedBy: {
        type: String,
        ref: 'User',
    },
    status: String,
    createdAt: Date,
    updatedAt: Date,
},{
    timestamps:true,
});

const match = mongoose.model('match', matchSchema);

module.exports = match;