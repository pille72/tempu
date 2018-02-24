const Sonde = require('ds18x20');

module.exports = function(address) {
    return {
        address: address,
        isConnected() {
            const isLoaded = Sonde.isDriverLoaded();
            if(isLoaded) {
                const listOfDeviceIds = Sonde.list();
                return (listOfDeviceIds.indexOf(this.address) !== -1);
            }

            return false;
        },

        get() {
            return Sonde.get(this.address);
        }
    }
};