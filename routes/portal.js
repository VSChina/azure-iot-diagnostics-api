var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/', function(req, res) {
    res.sendFile('portal/index.html',{'root': './'});
});

module.exports = router;
