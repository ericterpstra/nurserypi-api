const express = require('express');
const path = require('path');
const RFRoute = require('./routes/RF');
const CloudRoute = require('./routes/Clouds');

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
        const cloudRoute = new CloudRoute();

        this.express.use(rfRoute.path, rfRoute.router);
        this.express.use(cloudRoute.path, cloudRoute.router)
    }

    notfound(req, res, next) {
        res.sendFile('404.html',{ root: path.join(__dirname, '../public') });
    }

};