class Util {
    static getConnectionString() {
        return process.env.IOT_HUB_CONNECTION_STRING;
    }

    static getApiKey(index) {
        return process.env["APPLICATION_INSIGHT_API_KEY"+(index+1)];
    }

    static getAppId() {
        return process.env.APPLICAITON_INSIGHT_APP_ID;
    }

    static getStorageConnString(){
        return process.env.AZURE_STORAGE_CONNECTION_STRING || process.env.AZURE_STORAGE_ACCOUNT ||
            AZURE_STORAGE_ACCESS_KEY;
    }
}

module.exports = Util;