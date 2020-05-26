var express = require('express');
var router = express.Router();

var AccountService = require('../services/account.service.js');

/* GET users listing. */
/*router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});*/
router.post(`${process.env.logopt_endpoint}`, AccountService.signIn);
router.post(`${process.env.token_endpoint}`, AccountService.createToken);
router.post("", AccountService.createAccount);
router.get("", AccountService.selectAccounts);
router.get("/:id", AccountService.getAccount);
router.put("/:id", AccountService.updateAccount);
router.delete("/:id", AccountService.deleteAccount);

module.exports = router;
