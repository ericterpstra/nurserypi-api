const express = require('express');
const _ = require('lodash');
const rpi433 = require('rpi-433');

let rfEmitter;
const ON_1 = 9830156;
const OFF_1 = 9830148;
const ON_2 = 9830154; // Clouds
const OFF_2 = 9830146 // Clouds

const initRF = function() {
    rfEmitter = rpi433.emitter({
      pin: 17,
      pulseLength: 176  
    });
}

initRF();

module.exports = class RF {

    constructor(path = '/clouds') {
        this.router = express.Router();
        this.path = path;

        this.router.get('/', this.on);
        this.router.get('/on', this.on);
        this.router.get('/off', this.off);    
    }
    
    on(req, res) {
        rfEmitter.sendCode(ON_2, (err, stdOut) => {
            if(err) {
                return res.status(500).json({message: "Cannot send ON code."});
            }
            return res.status(200).json({powerStatus: "ON"});
        });
    }

    off(req, res) {
        rfEmitter.sendCode(OFF_2, (err, stdOut) => {
            if(err) {
                return res.status(500).json({message: "Cannot send OFF code."});
            }
            return res.status(200).json({powerStatus: "OFF"});
        });
    }

};