var express = require('express');
var router = express.Router();
var request = require('request');
var node_util = require('util');
var Util = require('../util/util');
var apicache = require('apicache');

var restUrl = 'https://api.applicationinsights.io/beta/apps/%s/metrics/%s?%s&aggregation=%s';
var d2cPath = 'customMetrics/D2CLatency';
var saPath = 'customMetrics/StreamJobLatency';
var failurePath = 'customMetrics/StreamInvalidMessage';
/* GET home page. */

router.get('/get/:param',apicache.middleware('2 minutes'), function (req, res) {
    var appId = Util.getAppId();
    if (!appId) {
        res.status(500).send("App id missing")
    }
    var keys = [];
    for (var i = 0; i < 5; i++) {
        var key = Util.getApiKey(i);
        if (!key) {
            res.status(500).send("Api key missing")
        }
        keys.push(key);
    }
    var param = req.params.param;
    if (!param) {
        res.sendStatus(400);
    }

    new Promise((resolve, reject) => {
        var result = {};
        var counter = 5;
        request(node_util.format(restUrl, appId, d2cPath, param,'avg'), {
            headers: {
                "x-api-key": keys[0]
            }
        }, apiCallback.bind(this, resolve, reject, 'd2c_avg',d2cPath,'avg'));

        request(node_util.format(restUrl, appId, saPath, param,'avg'), {
            headers: {
                "x-api-key": keys[1]
            }
        }, apiCallback.bind(this, resolve, reject, 'sa_avg',saPath,'avg'));

        request(node_util.format(restUrl, appId, d2cPath, param,'count'), {
            headers: {
                "x-api-key": keys[2]
            }
        }, apiCallback.bind(this, resolve, reject, 'd2c_count',d2cPath,'count'));

        request(node_util.format(restUrl, appId, saPath, param,'count'), {
            headers: {
                "x-api-key": keys[3]
            }
        }, apiCallback.bind(this, resolve, reject, 'sa_count',saPath,'count'));

        request(node_util.format(restUrl, appId, failurePath, param,'sum'), {
            headers: {
                "x-api-key": keys[4]
            }
        }, apiCallback.bind(this, resolve, reject, 'failure_sum',failurePath,'sum'));

        function apiCallback(resolve, reject, key,path,type, error, response, body) {
            console.log('callback called');
            body = JSON.parse(body);
            if (error) {
                reject(error);
            } else if (response.statusCode != 200) {
                reject("Invalid status code " + response.statusCode);
            } else {
                result[key] = body.value[path][type];
            }
            counter--;
            if (counter == 0) {
                resolve(result);
            }
        }
    }).then((result) => {
        res.send(result);
    }).catch((error) => {
        res.status(500).send(error);
    });

});

module.exports = router;
