var express = require('express');
var router = express.Router();
var uuid = require('uuid');

router.get('/get', (req, res) => {
    var id = req.query.id;
    var connectionString = req.query.connection_string;
    if (!id || !connectionString) {
        res.sendStatus(404);
    }
    var JobClient = require('azure-iothub').JobClient.fromConnectionString(connectionString);

    JobClient.getJob(id, (err, result) => {
        if (err) {
            res.write('Could not get job status: ' + err.message);
            res.status(404);
        } else {
            console.log(`Job: ${id} - status: ${result.status}`);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.write(JSON.stringify(result));
        }
        res.end();
    });
});

router.get('/trigger', (req, res) => {
    var connectionString = req.query.connection_string;
    if (!connectionString) {
        res.sendStatus(404);
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
    var queryCondition = '';
    if (req.query.devices) {
        queryCondition = "deviceId IN ['" + req.query.devices.replace(",","','") + "']";
    } else {
        var devices = [];
        var Registry = require('azure-iothub').Registry.fromConnectionString(connectionString);
        Registry.list((err, deviceList) => {
            if (err) {
                res.write('Could not trigger job: ' + err.message);
                res.status(404);
            } else {
                console.log(`${deviceList.length} device(s) found.`);
                deviceList.forEach((device) => {
                    this.devices.push(device.deviceId);
                });
                queryCondition = `deviceId IN ['${this.devices.join("','")}']`;
            }
        });
    }

    var JobClient = require('azure-iothub').JobClient.fromConnectionString(connectionString);
    JobClient.scheduleTwinUpdate(jobId,queryCondition,twinPatch,new Date(),3600,()=>{});
    res.end(jobId);
});

module.exports = router;
