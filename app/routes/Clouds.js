const express = require('express');
const request = require('request');
const rfEmitter = require('../lib/rfEmitter.js');
const piEmitter = rfEmitter.piEmitter;

const CLOUDS = {
    BIGBOY : "192.168.1.12",
    SKINNY : "192.168.1.13",
    STUBBY : "192.168.1.14"
};
const cloudNames = Object.keys(CLOUDS);
const cloudIPs = cloudNames.map( name => CLOUDS[name] );

const PATTERNS = {
    'RAINBOW' : 2,
    'COLOR_WAVES' : 0,
    'SOLID_COLOR' : 9
}

const COLORS = {
    'PINK' : { r: 245 , g: 225 , b: 234 },
    'PASTEL_AQUA' : { r: 181 , g: 220 , b: 225 },
    'PASTEL_YELLOW' : { r: 255 , g: 221 , b: 50 },
    'RED' : { r: 255 , g: 0 , b: 0 },
    'BLUE' : { r: 0 , g: 0 , b: 255 },
    'GREEN' : { r: 0 , g: 255 , b: 0 },
    'PURPLE' : { r: 128 , g: 0 , b: 255 },
    'MAGENTA' : { r: 255 , g: 0 , b: 255 },
    'ORANGE' : { r: 255 , g: 128 , b: 0 },
}

const TRI_COLOR_PALETTES = {
    'PASTEL' : [
        {cloud: CLOUDS.BIGBOY, color: COLORS.PINK},
        {cloud: CLOUDS.SKINNY, color: COLORS.PASTEL_AQUA},
        {cloud: CLOUDS.STUBBY, color: COLORS.PASTEL_YELLOW},
    ],
    'DARK' : [
        {cloud: CLOUDS.BIGBOY, color: COLORS.RED},
        {cloud: CLOUDS.SKINNY, color: COLORS.GREEN},
        {cloud: CLOUDS.STUBBY, color: COLORS.BLUE},
    ],

}

class Clouds {
    constructor(path = '/clouds') {
        this.router = express.Router();
        this.path = path;

        this.router.get('/on', this.on); // TODO: add ?cloud param for individual on/off
        this.router.get('/off', this.off);
        this.router.get('/brightness/:value', this.brightness);
        this.router.get('/rainbow', this.rainbow);
        this.router.get('/tricolor/:palette', this.tricolor);

    }

    on(req, res) {
        piEmitter.sendCode(rfEmitter.ON_2, (err, stdOut) => {
            console.log('Sent: ', rfEmitter.ON_2);
            if(err) {
                return res.status(500).json({message: "Cannot send ON code."});
            }
            return res.status(200).json({powerStatus: "ON"});
        });
    }

    off(req, res) {
        piEmitter.sendCode(rfEmitter.OFF_2, (err, stdOut) => {
            console.log('Sent: ', rfEmitter.OFF_2);
            if(err) {
                return res.status(500).json({message: "Cannot send OFF code."});
            }
            return res.status(200).json({powerStatus: "OFF"});
        });
    }

    brightness(req, res) {
        console.log('brightness');
        console.log(req.params);
        let cloudsIPsToChange = [];
        let command = '';

        // Check for cloud param
        if( req.query.cloud && CLOUDS[req.query.cloud] ) {
            console.log(req.query.cloud);
            cloudsIPsToChange.push(CLOUDS[req.query.cloud]);

        } else {
            cloudsIPsToChange = cloudIPs;
        }

        if ( req.params.value === 'UP' || req.params.value === 'up' ) {
            command = 'brightnessUp';
        } else if ( req.params.value === 'UP' || req.params.value === 'up' ) {
            command = 'brightnessDown';
        } else {
            command = `brightness?value=${req.params.value}`;
        }

        cloudsIPsToChange.forEach( cloudIP => {
            request.post({
                uri: `http://${cloudIP}/${command}`
            });
        });

        return res.status(200).json({brightness: req.params.value});

    }

    rainbow(req, res) {
        cloudIPs.forEach((cloud) => {
            request.post({
                uri: `http://${cloud}/pattern?value=3`
            });
        });
    }

    tricolor(req, res) {
        let chosenPalette;
        if (!req.params || !req.params.palette || !TRI_COLOR_PALETTES[req.params.palette]) {
            chosenPalette = 'DARK';
        } else {
            chosenPalette = req.params.palette;
        }

        TRI_COLOR_PALETTES[chosenPalette].forEach((color) => {
            request.post({
                uri: `http://${color.cloud}/solidColor`,
                qs: color.color
            })
        });

        res.send("OK");
    }
}



module.exports = Clouds