const TempUController = require('./lib/Controller');
const webserver = require('./lib/Webserver')(80);
const moment = require('moment');

TempUController.init(3000, 0x3c, 4, 22, '28-ef752e126461', 19, 23, 20, 30, 10, webserver, async (data) => {
    const time = moment().format('YYYY-MM-DD HH:mm:ss');
    console.log(time + ', ' + data);
});

TempUController.start();

webserver.start(() => {
    console.log('Server running at:', webserver.info.uri);
});