const express = require('express');
const request = require('request');
const rfEmitter = require('../lib/rfEmitter.js');
const piEmitter = rfEmitter.piEmitter;

const CLOUD_BIGBOY = "192.168.1.12";
const CLOUD_SKINNY = "192.168.1.13";
const CLOUD_STUBBY = "192.168.1.14";
const CLOUDS = [CLOUD_BIGBOY, CLOUD_SKINNY, CLOUD_STUBBY];

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
        {cloud: CLOUD_BIGBOY, color: COLORS.PINK},
        {cloud: CLOUD_SKINNY, color: COLORS.PASTEL_AQUA},
        {cloud: CLOUD_STUBBY, color: COLORS.PASTEL_YELLOW},
    ],
    'DARK' : [
        {cloud: CLOUD_BIGBOY, color: COLORS.RED},
        {cloud: CLOUD_SKINNY, color: COLORS.GREEN},
        {cloud: CLOUD_STUBBY, color: COLORS.BLUE},
    ],

}

class Clouds {
    constructor(path = '/clouds') {
        this.router = express.Router();
        this.path = path;

        this.router.get('/on', this.on);
        this.router.get('/off', this.off);
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

    rainbow(req, res) {
        CLOUDS.forEach((cloud) => {
            request.post({
                uri: `http://${cloud}/pattern?value=3`
            })
        });
    }

    tricolor(req, res) {
        console.log('params: ', req.params);  
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