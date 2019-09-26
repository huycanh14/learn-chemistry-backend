var express = require('express');
var router = express.Router();
var account = require("../modules/account.module.js");

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
    account.find({}, function (err, docs) {
        res.render('index', { data: docs });
        console.log(err)
        console.log(docs)
    })
});

module.exports = router;
