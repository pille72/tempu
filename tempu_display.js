var five = require("johnny-five");
var raspi = require('raspi-io');
var moment = require('moment');
var font = require('./font/oled-font-5x7');
var board = new five.Board({
  io: new raspi()
});

var Oled = require('oled-js');

board.on('ready', function() {
  console.log('Connected to Arduino, ready.');

  var opts = {
    width: 128,
    height: 64,
    address: 0x3C
  };

    var oled = new Oled(board, five, opts);
      // do cool oled things here
    oled.clearDisplay();

    oled.update();
        //oled.drawLine(1, 1, 128, 32, 1);

    // sets cursor to x = 1, y = 1
    oled.setCursor(0, 0);
    oled.writeString(font, 1, 'TempÜ - Station', 1, true, 2);

    // Temp / Luftfeuchte
    oled.setCursor(0, 18);
    oled.writeString(font, 2, ' aüö', 1, true, 2);
    oled.setCursor(80, 18);
    oled.writeString(font, 2, '20%', 1, true, 2);

    var now = moment().format('MMMM Do YYYY, h:mm:ss a');

    oled.setCursor(0, 47);
    oled.writeString(font, 1, now, 1, true, 2);

    oled.drawLine(1, 42, 127, 42, 1);


    var led = new five.Led(13);
    //var led2 = new five.Led("P1-13");
    //var led3 = new five.Led("P1-15");
    led.blink();
    //led2.blink();
    //led3.blink();

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
