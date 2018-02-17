'use strict';

const Oled = require('oled-js');
const five = require("johnny-five");
const moment = require('moment');
const font = require('oled-font-5x7');

class TempUDisplay {
    constructor(address, temperature, humidity){
        this.address = address;
        this.temperature = temperature;
        this.humidity = humidity;
        this.display = null;
    }

    initDisplay(board) {
        this.board = board;
        var displayOptions = {
            width: 128,
            height: 64,
            address: this.address
        };

        this.display = new Oled(this.board, five, displayOptions);
        this.display.clearDisplay();
    }

    setTemperature(temperature) {
        this.temperature = temperature;
    }

    setHumidity(humidity) {
        this.humidity = humidity;
    }

    update() {
        this.display.update();
        //oled.drawLine(1, 1, 128, 32, 1);

        // sets cursor to x = 1, y = 1
        this.display.setCursor(0, 0);
        this.display.writeString(font, 1, 'TempÜ - Station', 1, true, 2);

        // Temp / Luftfeuchte
        this.display.setCursor(0, 18);
        this.display.writeString(font, 2,  this.temperature + '°C', 1, true, 2);
        this.display.setCursor(65, 18);
        this.display.writeString(font, 2, this.humidity + '%', 1, true, 2);

        var now = moment().format('MMMM Do YYYY, h:mm:ss a');

        this.display.setCursor(0, 47);
        this.display.writeString(font, 1, now, 1, true, 2);
        this.display.drawLine(1, 42, 127, 42, 1);
    }
}

module.exports = TempUDisplay;