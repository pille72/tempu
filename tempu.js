const TempUController = require('./lib/Controller');
const sqlite = require('sqlite');
const moment = require('moment');

const sqliteFile = __dirname + '/../data/tempu.sqlite';
const dbPromise = sqlite.open(sqliteFile, { promise: Promise });

TempUController.init(3000, 0x3c, 4, 11, 19, 23, 10, async (data) => {
    console.log('TempU - Data: ', data);

    const db = await dbPromise;
    let date = moment().format('YYYY-MM-DD');
    let time = moment().format('YYYY-MM-DD H:mm:ss');
    let ledColor = data.ledColor;
    db.run("INSERT INTO measured_data (temperature, humidity, time, date, led_color) VALUES(?,?,?,?,?)", data.temperature, data.humidity, time, date, ledColor);
});

TempUController.start();