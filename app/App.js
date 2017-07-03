const express = require('express');
const RFRoute = require('./routes/RF');

module.exports = class Api {

    constructor() {
        this.express = express();

        // Set up middleware
        this.middleware();

        // Set up routes
        this.routes();

        // Set custom 404 page
        this.express.use(this.notfound);
    }

    // register middlewares
    middleware() {
        this.express.use(express.static('public'));
    }

    // connect resource routers
    routes() {
        const rfRoute = new RFRoute();
        const cloudRout = new CloudRoute();

        this.express.use(rfRoute.path, rfRoute.router);
    }

    notfound(req, res, next) {
        res.sendfile('public/404.html');
    }

};