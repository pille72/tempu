
const webserver = require('./lib/Webserver')(8000);

webserver.start(() => {
    console.log('Server running at:', webserver.info.uri);
});