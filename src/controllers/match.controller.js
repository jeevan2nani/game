const matchService = require('../services/match.service');
const catchAsync = require('../utils/catchAsync');

const createMatch = catchAsync( async( req, res) => {
    const {body} = req
    const match = await matchService.createMatch({...body, createdBy: req.userId});
    res.send(match);
});

const updateMatch = catchAsync( async( req, res) => {
    const { id } = req.params;
    const { body } = req.body;
    const match = await matchService.updateMatch({...body, updatedBy: req.userId},id);
    res.send(match);
});

module.exports = {
    createMatch,
    updateMatch,
}