var express = require('express');
var router = express.Router();
// var account = require("../modules/account.module.js");
var accountService = require("../services/account.service.js");

/* GET home page. */
router.post('/logopt', function(req, res, next) {
    // res.send(req.body);
    // res.send(req);
    res.send(accountService.Login(req.body));
});

module.exports = router;