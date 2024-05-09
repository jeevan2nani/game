const match = require('../models/match.model');

const createMatch = async( body) => match.create(body);

const updateMatch = async(body, id) => match.updateOne({_id: id}, body);

const getMatchByFilter = async(filter) => match.findOne(filter);

const getMatchsByFilter = async(filter) => match.find(filter);

const deleteMatch = async(id) => match.deleteOne({_id: id});

module.exports = {
    createMatch,
    updateMatch,
    deleteMatch,
    getMatchByFilter,
    getMatchsByFilter,
};