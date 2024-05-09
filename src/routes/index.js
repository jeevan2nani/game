const express = require('express');
const gameRoute = require('./game.route');
const matchRoute = require('./match.route');
const playerRoute = require('./player.route');
const router = express.Router();

const defaultRoutes = [
    {
        path: '/match',
        route: matchRoute,
    },
    {
        path:'/game',
        route: gameRoute,
    },
    {
        path:'/players',
        route: playerRoute,
    },
];

defaultRoutes.forEach( route => {
    router.use(route.path, route.route);
});

module.exports = router;