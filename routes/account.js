var express = require('express');
var router = express.Router();
// var account = require("../modules/account.module.js");
var accountService = require("../services/account.service.js");
const router_config = require('../helpers/router-config.js');

/* GET home page. */
router.post(router_config.account.logopt_endpoint, accountService.Login);
router.post(router_config.account.token_endpoint, accountService.Token);
router.post(router_config.account.create_account, accountService.Create);
router.get(router_config.account.select_account, accountService.Select);

module.exports = router;