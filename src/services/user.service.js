const userModel = require('../models/user.model');

const getUserByFilter = async(filter) => userModel.findOne(filter);

const updateUser = async(id, body) => userModel.findByIdAndUpdate(id, body);

module.exports = {
    getUserByFilter,
    updateUser,
}