const five = require("johnny-five");
const raspi = require('raspi-io');
const TempUDisplay = require('./lib/TempuDisplay');

const board = new five.Board({
    io: new raspi()
});

const display = new TempUDisplay(board, 0x3c, '0', '0');

var rpiDhtSensor = require('rpi-dht-sensor');

var dht = new rpiDhtSensor.DHT11(2);

function read () {
    var readout = dht.read();

    console.log('Temperature: ' + readout.temperature.toFixed(2) + 'C, ' +
        'humidity: ' + readout.humidity.toFixed(2) + '%');
    setTimeout(read, 5000);
}
read();


board.on('ready', function() {
    console.log('Connected to Arduino, ready.');

    display.initDisplay();
    display.update();

    var temp = 30;

    setInterval(() => {
        display.setTemperature(--temp);
        display.setHumidity('22.5');
        display.update();
    }, 2000);

    var led = new five.Led('P1-13');
    var led2 = new five.Led('P1-19');
    var led3 = new five.Led('P1-22');
    led.blink();
    led2.blink();
    led3.blink();

    /*
    var multi = new five.Multi({
      io: new raspi(),
      controller: "DHT22_I2C_NANO_BACKPACK",
      pin: 4
    });

    multi.on("change", function() {
      console.log("Thermometer");
      console.log("  celsius           : ", this.thermometer.celsius);
      console.log("  fahrenheit        : ", this.thermometer.fahrenheit);
      console.log("  kelvin            : ", this.thermometer.kelvin);
      console.log("--------------------------------------");

      console.log("Hygrometer");
      console.log("  relative humidity : ", this.hygrometer.relativeHumidity);
      console.log("--------------------------------------");
    });
  */
});
