let interval;
const TempUDisplay = require('./TempuDisplay');
const five = require("johnny-five");
const raspi = require('raspi-io');
const DHTSensor = require('./DHTSensor');


const Controller = {
    pollIntervall: 3000,
    display: null,
    sensor: null,
    board: null,
    readCallback: null,
    goodTempMin: 0,
    goodTempMax: 0,
    mediumDelta: 0,
    greenLED: null,
    yellowLED: null,
    redLED: null,

    init(pollIntervall, displayAddress, sensorPIN, sensorType, goodTempMin, goodTempMax, mediumDelta, readCallback) {
        this.display = new TempUDisplay(displayAddress, '0', '0');
        this.readCallback = readCallback;

        this.board = new five.Board({
            io: new raspi()
        });

        this.board.on('ready', function() {
            Controller.onBoardReady.call(Controller);
        });

        this.pollIntervall = pollIntervall;

        this.goodTempMax = goodTempMax;
        this.goodTempMin = goodTempMin;
        this.mediumDelta = mediumDelta;
    },

    onBoardReady() {
        console.log('Connected to TempÜ, ready.');
        this.display.initDisplay(this.board);

        this.sensor = DHTSensor(sensorPIN, sensorType);

        this.redLED = new five.Led('P1-15');
        this.greenLED = new five.Led('P1-11');
        this.yellowLED = new five.Led('P1-13');
        this.display.initDisplay();
        this.display.update();
    },

    start() {
        interval = setInterval(() => {
            this.read();
        }, this.pollIntervall);
    },

    read() {
        let data = this.sensor.read();
        this.readCallback(data);

        this.display.setTemperature(data.temperature);
        this.display.setHumidity(data.humidity);
        this.display.update();

        if( ( (data.temperature <= this.goodTempMax ) && (data.temperature >= this.goodTempMax) ) &&
            ( (data.humidity <= this.goodTempMax ) && (data.humidity >= this.goodTempMax) )
        ) {
            // LED GRÜN
            this.greenLED.on();
            this.yellowLED.off();
            this.redLED.off();
        }
        else if(
            ( data.temperature >= ( (data.temperature * this.mediumDelta) / 100 ) ||
            data.temperature <= ( (data.temperature * this.mediumDelta) / 100 ) ) ||
            ( data.humidity >= ( (data.humidity * this.mediumDelta) / 100 ) ||
                data.humidity <= ( (data.humidity * this.mediumDelta) / 100 ) )
        ) {
            this.greenLED.off();
            this.yellowLED.on();
            this.redLED.off();
        }
        else {
            this.greenLED.off();
            this.yellowLED.off();
            this.redLED.on();
        }

    },

    stop() {
        clearInterval(interval);
    }
};

module.exports = Controller;