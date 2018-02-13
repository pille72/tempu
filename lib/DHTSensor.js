const rpiDhtSensor = require('rpi-dht-sensor');

let dht;

module.exports = function(pin, type) {
    if(type === 11) {
        dht = new rpiDhtSensor.DHT11(pin);
    }
    if(type === 22) {
        dht = new rpiDhtSensor.DHT22(pin);
    }

    return {
        read: function() {
            let readout = dht.read();
            return {
                temperature: readout.temperature.toFixed(2),
                humidity: readout.humidity.toFixed(2)
            };
        }
    };
};