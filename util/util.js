class Util {
    static getConnectionString() {
        return process.env.IOT_HUB_CONNECTION_STRING;
    }
}

module.exports = Util;