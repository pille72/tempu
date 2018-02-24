const sqlite = require('sqlite');
const sqliteFile = __dirname + '/../data/tempu.sqlite';
const dbPromise = sqlite.open(sqliteFile, { promise: Promise });
const fs = require('fs');
const moment = require('moment');

const Hapi = require('hapi');

module.exports = function(port) {
    let server = new Hapi.Server();
    server.connection({ port: port || 8000, host: '0.0.0.0'});

    server.route({
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: 'webui',
                listing: true
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: function (request, reply) {
            reply.file('webui/index.html');
        }
    });

    server.route({
        method: 'GET',
        path: '/export-sql',
        handler: async function (request, reply) {
            try {
                let buf = new Buffer(fs.readFileSync(sqliteFile), 'binary');
                let fileDate = moment().format('YYYY-MM-DD_HH-m');
                return reply(buf)
                    .encoding('binary')
                    .type('application/x-sqlite3')
                    .header('content-disposition', 'attachment; filename=db-' + fileDate + '.sqlite;');
            }
            catch (err) {
                reply(err);
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/last-7-days',
        handler: async function (request, reply) {
            try {
                const db = await dbPromise;
                let data = await db.all('SELECT DISTINCT date as date FROM `measured_data` ORDER BY time DESC LIMIT 0,7');
                let days = [];
                for(let i = 0; i<data.length; i++) {
                    let day = await db.get('SELECT AVG(temperature) as avgTemp, AVG(humidity) as avgHum FROM `measured_data` WHERE date = ?', data[i].date);
                    days.push({
                        avgTemp: day.avgTemp,
                        avgHum: day.avgHum,
                        date: moment(data[i].date).format('DD.MM.YYYY')
                    });
                }
                // read from DB
                reply({days: days});
            }
            catch (err) {
                reply(err);
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/last-day',
        handler: async function (request, reply) {
            try {
                const lastDay = moment().subtract(1, 'day').format('DD-MM-YYYY');
                const db = await dbPromise;
                let data = await db.all('SELECT * FROM `measured_data` ORDER BY time DESC WHERE date = "'+lastDay+'"');
                reply({lastDay: data});
            }
            catch (err) {
                reply(err);
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/current-temperature',
        handler: async function (request, reply) {
            try {
                const db = await dbPromise;
                let data = await db.get('SELECT * FROM measured_data ORDER BY time DESC LIMIT 0,1');
                // read from DB
                if(data) {
                    reply({
                        temperature: data.temperature,
                        humidity: data.humidity,
                        time: moment(data.time).format('DD.MM.YYYY H:m'),
                        ledColor: data.led_color,
                        sondeTemperature: data.sonde_temperature,
                        data: true
                    });
                }
                else {
                    reply({data: false});
                }
            }
            catch (err) {
                reply(err);
            }
        }
    });

    server.logTempUData = async function(data) {
        const db = await dbPromise;
        let date = moment().format('YYYY-MM-DD');
        let time = moment().format('YYYY-MM-DD HH:mm:ss');
        let ledColor = data.ledColor;
        db.run("INSERT INTO measured_data (temperature, humidity, time, date, led_color, sonde_temperature) VALUES(?,?,?,?,?,?)",
            data.temperature,
            data.humidity,
            time,
            date,
            ledColor,
            data.sondeTemperature
        );
    };

    return server;
};

