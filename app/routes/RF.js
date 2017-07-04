const express = require('express');
const rfEmitter = require('../lib/rfEmitter.js');
const emitter = rfEmitter.emitter;

console.log('emitter ', rfEmitter);

module.exports = class RF {

    constructor(path = '/rf') {
        this.router = express.Router();
        this.path = path;

        this.router.get('/', this.on);
        this.router.get('/on', this.on);
        this.router.get('/off', this.off);    
    }
    
    on(req, res) {
        emitter.sendCode(rfEmitter.ON_2, (err, stdOut) => {
            if(err) {
                return res.status(500).json({message: "Cannot send ON code."});
            }
            return res.status(200).json({powerStatus: "ON"});
        });
    }

    off(req, res) {
        emitter.sendCode(rfEmitter.OFF_2, (err, stdOut) => {
            if(err) {
                return res.status(500).json({message: "Cannot send OFF code."});
            }
            return res.status(200).json({powerStatus: "OFF"});
        });
    }

};