const TempUController = require('./lib/Controller');

TempUController.init(3000, 0x3c, 4, 11, (data) => {
    console.log('TempU - Data: ', data);
});

TempUController.start();