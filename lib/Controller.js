let interval;
const TempUDisplay = require('./TempuDisplay');
const five = require("johnny-five");
const raspi = require('raspi-io');
const DHTSensor = require('./DHTSensor');
const Sonde = require('./Sonde');
const Webserver = require('./Webserver');


const Controller = {
    pollIntervall: 3000,
    display: null,
    sensor: null,
    sonde: null,
    sondeAddress: null,
    board: null,
    readCallback: null,
    goodTempMin: 0,
    goodTempMax: 0,
    mediumDelta: 0,
    greenLED: null,
    yellowLED: null,
    redLED: null,
    webserver: null,

    init(pollIntervall, displayAddress, sensorPIN, sensorType, sondeAddress, goodTempMin, goodTempMax, goodHumMin, goodHumMax, mediumDelta, readCallback) {
        this.sensorPIN = sensorPIN;
        this.sensorType = sensorType;
        this.readCallback = readCallback;
        this.displayAddress = displayAddress;
        this.sondeAddress = sondeAddress;
        this.sonde = Sonde(this.sondeAddress);
        this.webserver = Webserver(80, this.settingsCallback, this.getSettings);

        this.webserver.start(() => {
            console.log('Server running');
        });

        this.board = new five.Board({
            io: new raspi(),
            repl: false
        });

        this.board.on('ready', function() {
            Controller.onBoardReady.call(Controller);
        });

        this.pollIntervall = pollIntervall;

        this.goodTempMax = goodTempMax;
        this.goodTempMin = goodTempMin;
        this.mediumDelta = mediumDelta;

        this.goodHumMin = goodHumMin;
        this.goodHumMax = goodHumMax;
    },

    settingsCallback(data) {
        Controller.goodTempMax = data.maxTemp;
        Controller.goodTempMin = data.minTemp;
        Controller.mediumDelta = data.delta;
        Controller.goodHumMin = data.minHum;
        Controller.goodHumMax = data.maxHum;
    },

    getSettings() {
      return {
          goodTempMax: Controller.goodTempMax,
          goodTempMin: Controller.goodTempMin,
          mediumDelta: Controller.mediumDelta
      };
    },

    onBoardReady() {
        console.log('Connected to TempÜ, ready.');
        this.display = new TempUDisplay(this.displayAddress, '0', '0');
        this.sensor = DHTSensor(this.sensorPIN, this.sensorType);

        this.redLED = new five.Led('P1-15');
        this.greenLED = new five.Led('P1-11');
        this.yellowLED = new five.Led('P1-13');

        this.display.initDisplay(this.board);
        this.display.update();
    },

    start() {
        interval = setInterval(() => {
            this.read();
        }, this.pollIntervall);
    },

    read() {
        let data = this.sensor.read();

        if(this.sonde.isConnected()) {
            const sondeTemperature = this.sonde.get();
            if(sondeTemperature !== 0) {
                this.display.setSondeStatus(true);
                this.display.setSondeTemperature(sondeTemperature);
                data.sondeTemperature = sondeTemperature;
            }
            else {
                this.display.setSondeStatus(false);
                data.sondeTemperature = 0;
            }
        }

        this.display.setTemperature(data.temperature);
        this.display.setHumidity(data.humidity);
        this.display.update();
        
        if( ( (data.temperature <= this.goodTempMax) && (data.temperature >= this.goodTempMin) ) ) {
            // LED GRÜN
            this.greenLED.on();
            this.yellowLED.off();
            this.redLED.off();
            data.ledColor = 'green';
        }
        else if (
            ( data.temperature >= ( this.goodTempMin - (this.goodTempMin * this.mediumDelta) / 100 ) ) &&
            ( data.temperature <= ( this.goodTempMax + (this.goodTempMax * this.mediumDelta) / 100 ) )
        ) {
            this.greenLED.off();
            this.yellowLED.on();
            this.redLED.off();
            data.ledColor = 'yellow';
        }
        else {
            this.greenLED.off();
            this.yellowLED.off();
            this.redLED.on();
            data.ledColor = 'red';
        }

        this.webserver.logTempUData(data);
        this.readCallback(data);
    },

    stop() {
        clearInterval(interval);
    }
};

module.exports = Controller;
