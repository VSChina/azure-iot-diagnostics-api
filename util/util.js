class Util {
    static getConnectionString() {
        return process.env.IOT_HUB_CONNECTION_STRING;
    }

    static getApiKey(index) {
        return process.env["APPLICATION_INSIGHT_API_KEY"+index];
    }

    static getAppId() {
        return process.env.APPLICAITON_INSIGHT_APP_ID;
    }
}

module.exports = Util;