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
        this.sondeActive = false;
        this.sondeTemperature = 0;
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

    setSondeTemperature(temperature) {
        this.sondeTemperature = temperature;
    }

    setSondeStatus(status) {
        this.sondeActive = status;
    }

    setTemperature(temperature) {
        this.temperature = temperature;
    }

    setHumidity(humidity) {
        this.humidity = humidity;
    }

    update() {
        this.display.clearDisplay();
        this.display.update();
        //oled.drawLine(1, 1, 128, 32, 1);

        // sets cursor to x = 1, y = 1
        this.display.setCursor(0, 0);
        this.display.writeString(font, 1, 'TempÜ - Station', 1, true, 2);

        // Temp / Luftfeuchte
        this.display.setCursor(0, 18);
        this.display.writeString(font, 1,  this.temperature + '°C', 1, true, 2);
        this.display.setCursor(65, 18);
        this.display.writeString(font, 1, this.humidity + '%', 1, true, 2);


        if(this.sondeActive === true) {
            this.display.setCursor(0, 47);
            this.display.writeString(font, 1, 'Sonde', 1, true, 2);
            this.display.setCursor(40, 47);
            this.display.writeString(font, 1, this.sondeTemperature + '°C', 1, true, 1);
            this.display.drawLine(1, 40, 127, 42, 1);
            const now = moment().format('HH:mm');
            this.display.setCursor(93, 55);
            this.display.writeString(font, 1, now, 1, true, 2);
        }
        else {
            const now = moment().format('DD.MM.YYYY, HH:mm');
            this.display.setCursor(0, 47);
            this.display.writeString(font, 1, now, 1, true, 2);
            this.display.drawLine(1, 40, 127, 42, 1);
        }
    }
}

module.exports = TempUDisplay;