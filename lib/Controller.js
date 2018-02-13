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

    init(pollIntervall, displayAddress, sensorPIN, sensorType, readCallback) {
        this.board = new five.Board({
            io: new raspi()
        });

        this.board.on('ready', function() {
            Controller.onBoardReady.call(Controller);
        });

        this.pollIntervall = pollIntervall;

        this.display = new TempUDisplay(this.board, displayAddress, '0', '0');
        this.display.initDisplay();

        this.sensor = DHTSensor(sensorPIN, sensorType);
        this.readCallback = readCallback;
    },

    onBoardReady() {
        console.log('Connected to TempÜ, ready.');
        this.display.initDisplay();
        this.display.update();
    },

    start() {
        interval = setInterval(() => {
            this.read();

            /* TEST */
            var led = new five.Led('P1-11');
            var led2 = new five.Led('P1-13');
            var led3 = new five.Led('P1-15');
            led.on();
            led2.on();
            led3.on();


        }, this.pollIntervall);
    },

    read() {
        let data = this.sensor.read();
        this.readCallback(data);

        this.display.setTemperature(data.temperature);
        this.display.setHumidity(data.humidity);
        this.display.update();
    },

    stop() {
        clearInterval(interval);
    }
};

module.exports = Controller;