const sqlite = require('sqlite');
const dbPromise = sqlite.open(__dirname + '/../data/tempu.sqlite', { promise: Promise });

const Hapi = require('hapi');

const dummyT = [20, 22, 21, 23, 24, 25, 26, 19];
const dummyHu = [40, 50, 60, 44, 55, 66, 22, 33];

function getRandomArbitrary(min, max) {
    return parseInt(Math.random() * (max - min) + min);
}


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

    //;

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
                        date: data[i].date
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
        path: '/current-temperature',
        handler: async function (request, reply) {
            try {
                const db = await dbPromise;
                let data = await db.get('SELECT * FROM measured_data ORDER BY time DESC');
                // read from DB
                reply({temperature: data.temperature, humidity: data.humidity});
            }
            catch (err) {
                reply(err);
            }
        }
    });

    return server;
};

