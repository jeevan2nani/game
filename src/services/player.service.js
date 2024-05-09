const playerModel = require('../models/player.model');

const createPlayer = async(body) => playerModel.create(body);

const createPlayers = async( body) => playerModel.insertMany(body);

const getPlayerById = async(id) => playerModel.findById(id);

const getPlayersByFilter = async(filter) => playerModel.find(filter);

module.exports = {
    createPlayer,
    createPlayers,
    getPlayerById,
    getPlayersByFilter,
}