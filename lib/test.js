const sqlite = require('sqlite');
const moment = require('moment');

const sqliteFile = __dirname + '/../data/tempu.sqlite';
const dbPromise = sqlite.open(sqliteFile, { promise: Promise });


async function test() {
    const db = await dbPromise;
    let date = moment().format('YYYY-MM-DD');
    let time = moment().format('YYYY-MM-DD H:mm:ss');
    let ledColor = 'green';
    db.run("INSERT INTO measured_data (temperature, humidity, time, date, led_color) VALUES(?,?,?,?,?)", 10, 10, time, date, ledColor);
}

test();
