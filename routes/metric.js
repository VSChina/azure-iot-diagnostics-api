var express = require('express');
var router = express.Router();
var request = require('request');
var node_util = require('util');
var azure = require("azure-storage");
var Util = require('../util/util');
var apicache = require('apicache');
var fs = require('fs');

var restUrl = 'https://api.applicationinsights.io/beta/apps/%s/metrics/%s?%s&aggregation=%s';
var d2cPath = 'customMetrics/D2CLatency';
var saPath = 'customMetrics/StreamJobLatency';
var saFailurePath = 'customMetrics/StreamInvalidMessage';
var funcPath = 'customMetrics/FunctionLatency';
var funcFailurePath = 'customMetrics/FunctionInvalidMessage';
var kustoPath = 'https://analytics.applicationinsights.io%s/components/%s';

var tableService = azure.createTableService();

var tableKeyNameMap = {
    "D2CLatencyTable": "d2c_success",
    "StreamLatencyTable": "sa_success",
    "StreamErrorTable": "sa_failure_count",
    "FuncLatencyTable": "func_success",
    "FuncErrorTable": "func_failure_count"
};

var timeSecondsMap = {
    "timespan=PT10M": 600,
    "timespan=PT1H": 3600,
    "timespan=PT24H": 878400,
    "timespan=PT7D": 6148800
};

/* GET home page. */

router.get('/kusto', function (req, res) {
    res.redirect(node_util.format(kustoPath, process.env.RESOURCE_GROUP_NAME, process.env.APPLICATION_INSIGHTS_NAME));
});

router.get('/get/:param', apicache.middleware('5 seconds'), function (req, res) {

    var storageConnString = Util.getStorageConnString();
    if (!storageConnString) {
        res.status(500).send("Azure storage connection string missing")
    }

    var param = req.params.param;
    if (!param || !(param in timeSecondsMap)) {
        res.sendStatus(400);
    }

    new Promise((resolve, reject) => {

        function isLatencyTable(tableName){
            return tableName == 'StreamLatencyTable' || tableName == 'D2CLatencyTable' || tableName == 'FuncLatencyTable';
        }

        function getColumnName(tableName){
            return isLatencyTable(tableName) ? 'Latency' : "PartitionKey";
        }

        function newTableQuery(tableName, timeUtcString) {
            return new azure.TableQuery()
                .select([getColumnName(tableName)])
                .where('PartitionKey ge ?', timeUtcString);
        }

        function queryAllEntries(tableName, query, token, callback) {
            if (token == null) {
                entriesMap[tableName] = [];
            }

            tableService.queryEntities(tableName, query, token,
                function (error, results) {
                    if (error) {
                        //handle error
                        callback(tableName, error);
                        return;
                    }

                    Array.prototype.push.apply(entriesMap[tableName], results.entries);
                    if (results.continuationToken) {
                        queryAllEntries(tableName, query, results.continuationToken, callback);
                    }
                    else {
                        callback(tableName, error, results);
                    }
                });
        }

        var entriesMap = {};
        var result = {};
        var counter = 5;
        var periodInSeconds = timeSecondsMap[param];

        var timeUtc = Date.now() / 1000;
        var startTimeUtcString = (timeUtc - periodInSeconds).toFixed();

        for (var tableName in tableKeyNameMap) {
            if (tableKeyNameMap.hasOwnProperty(tableName)) {
                queryAllEntries(tableName, newTableQuery(tableName, startTimeUtcString), null,
                    apiCallback.bind(this, resolve, reject, timeUtc));
            }
        }

        //create bug if: 20 failures in past 10 mins
        function createBugIfNecessary(entries, utcTime){
            if(entries.length == 0 || fs.existsSync('bug_created'))
                return;
            var threshold = 20;
            var startTime = timeUtc - 600;
            var len = entries.length;
            var failureCount = 0;
            while(len--){
                var time = +entries[len].PartitionKey._;
                if(time < startTime)
                    break;
                ++failureCount;
                if(failureCount >= threshold)
                    break;
            }
            if(failureCount >= threshold){
                var curTime = new Date();
                var pastTime =new Date();
                pastTime.setMinutes(pastTime.getMinutes() - 10);
                createBug("[E2E Diagnostics] Raspi cannot Send Temperature Messages Correctly in Past 10 Minutes", "Renlong Tu", `[${pastTime}] - [${curTime}]` + ' 20 failures in past 10 mins was detected.\nError: Fail to read temperature sensor data.');
                console.log("Bug created");
                fs.writeFileSync('bug_created','1');
            }
        }

        function createBug(title, creator, reproSteps) {
            var request = require('request');
            var accessToken = "lnucss6gdzhshocushxkrwqiosvcn77sliiiixslcoe72u6gc5ra";
            var json = `
        [
            {
                    "op": "add",
                    "path": "/fields/System.Title",
                    "value": "${title}"
            },
            {
                    "op": "add",
                    "path": "/fields/Microsoft.DevDiv.IssueType",
                    "value": "Code Defect"
            },
            {
                    "op": "add",
                    "path": "/fields/System.AreaPath",
                    "value": "VSIoT\\\\E2E Diagnostic"
            },
            {
                    "op": "add",
                    "path": "/fields/System.CreatedBy",
                    "value": "${creator}"
                },
            {
                    "op": "add",
                    "path": "/fields/Microsoft.VSTS.TCM.ReproSteps",
                    "value": "${reproSteps}"
            }, {
                    "op": "add",
                    "path": "/fields/Microsoft.VSTS.Common.Priority",
                    "value": "1"
            }, {
                    "op": "add",
                    "path": "/fields/Microsoft.VSTS.Common.Severity",
                    "value": "2 - High"
            }
        ]
        `;

            var options = {
                url: 'https://mseng.visualstudio.com/DefaultCollection/VSIoT/_apis/wit/workitems/$Bug?api-version=1.0',
                dataType: 'json',
                headers: {
                    'Authorization': 'Basic ' + new Buffer("" + ":" + accessToken).toString('base64'),
                    'content-type': 'application/json-patch+json'
                },
                body: json
            };

            request.patch(options, function(err, res, body) {
                if (err) {
                    console.error('error: ', err);
                } else {
                    // console.log(body);
                }
            });
        }


        function apiCallback(resolve, reject, timeUtc, tableName, error) {
            console.log('callback called:' + tableName);
            if (error) {
                console.log('api call back' + error);
                reject(error);
            } else {
                var entries = entriesMap[tableName];
                var key = tableKeyNameMap[tableName];
                result[key] = {};

                if (isLatencyTable(tableName)) {
                    result[key]['count'] = entries.length;
                    if (entries.length > 0) {
                        var len = entries.length;
                        var sum = 0;
                        var max = 0;
                        while (len--) {
                            var value = entries[len].Latency._;
                            sum += value;
                            max = Math.max(max, value);
                        }
                        result[key]['max'] = Math.round(max);
                        result[key]['avg'] = Math.round((sum / entries.length));
                    }
                    else {
                        result[key]['max'] = result[key]['avg'] = null;
                    }
                }
                else{
                    result[key]['sum'] = entries.length;

                    createBugIfNecessary(entries, timeUtc);
                }
            }
            counter--;
            if (counter == 0) {
                resolve(result);
            }
        }
    }).then((result) => {
        console.log(result);
        res.send(result);
    }).catch((error) => {
        res.status(500).send(error);
    });
});

module.exports = router;
