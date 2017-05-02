var express = require('express');
var router = express.Router();
var uuid = require('uuid');
var Util = require('../util/util');

router.get('/get', (req, res) => {
    var id = req.query.id;
    var connectionString = Util.getConnectionString();
    if (!id || !connectionString) {
        res.sendStatus(400);
    }
    var JobClient = require('azure-iothub').JobClient.fromConnectionString(connectionString);

    JobClient.getJob(id, (err, result) => {
        if (err) {
            res.status(500).send('Could not get job status: ' + err.message);
        } else {
            console.log(`Job: ${id} - status: ${result.status}`);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.write(JSON.stringify(result));
        }
        res.end();
    });
});

router.get('/trigger', (req, res) => {
    var connectionString = Util.getConnectionString();
    if (!connectionString || (!req.query.diag_enable && !req.query.diag_rate)) {
        res.sendStatus(400);
    }
    var twinPatch = {
        etag: '*',
        properties: {
            desired: {}
        }
    };
    if (req.query.diag_enable) {
        twinPatch.properties.desired.diag_enable = req.query.diag_enable === 'true';
    }
    if (req.query.diag_rate) {
        twinPatch.properties.desired.diag_sample_rate = req.query.diag_rate;
    }
    var jobId = uuid.v4();
    var queryCondition = getQueryCondition(req.query.devices,connectionString);
    try {
        var JobClient = require('azure-iothub').JobClient.fromConnectionString(connectionString);
    }
    catch (e) {
        res.status(500).send(e.message);
    }
    queryCondition.then((query) => {
        JobClient.scheduleTwinUpdate(jobId, query, twinPatch, new Date(), 3600, (err) => {
            if (err) {
                res.status(500).send('Could not schedule twin update job: ' + err.Message);
            } else {
                res.end(jobId);
            }
        });
    }).catch((err) => {
        res.status(500).send(err);
    })


});

function getQueryCondition(deviceString,connectionString) {
    return new Promise((resolve, reject) => {
        if (deviceString) {
            resolve("deviceId IN ['" + deviceString.replace(/,/g, "','") + "']");
        } else {
            var devices = [];
            var Registry = require('azure-iothub').Registry.fromConnectionString(connectionString);
            Registry.list((err, deviceList) => {
                if (err) {
                    console.log('mjerror')
                    reject('Could not trigger job: ' + err.message);
                } else {
                    console.log(`${deviceList.length} device(s) found.`);
                    deviceList.forEach((device) => {
                        devices.push(device.deviceId);
                    });
                    console.log(devices.length);
                    resolve(`deviceId IN ['${devices.join("','")}']`);
                }
            });
        }
    });
}

module.exports = router;
