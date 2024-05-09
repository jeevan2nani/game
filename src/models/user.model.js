const mongoose = require('mongoose');
const {v4} = require('uuid');


const userSchema = new mongoose.Schema({
    _id:{
        type: String,
        default() {
            return `user_${v4()}`;
        }
    },
    name: String,
    email: String,
    password: String,
    createdAt: Date,
    updatedAt: Date,
    walletAmount: Number,
},{
    timestamps: true,
})

const User = mongoose.model('User',userSchema);

module.exports = User;