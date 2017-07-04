let rpi433;
let stub = {
        emitter(a) {
            console.log('emitting: ', a);
            return {
                    sendCode(code, cb) {
                    console.log('sending: ', code);
                    return cb(false, 'testOk');
                }
            }
        }
    }

if (process.env.USE_RF === 'false') {
    rpi433 = stub;
} else {
    try {
        rpi433 = require('rpi-433');
    } catch (e) {
        rpi433 = stub;
    }
}

let rfEmitter;
const ON_1 = 9830156;
const OFF_1 = 9830148;
const ON_2 = 9830154; // Clouds
const OFF_2 = 9830146 // Clouds


rfEmitter = rpi433.emitter({
    pin: 17,
    pulseLength: 176  
});

module.exports = {
    emitter: rfEmitter,
    ON_1,
    OFF_1,
    ON_2,
    OFF_2
}