var express = require('express');
var router = express.Router();

var AccountController = require('../controllers/account.controller.js');

/* GET users listing. */
/*router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});*/
router.post(`${process.env.logopt_endpoint}`, AccountController.signIn);
router.post(`${process.env.token_endpoint}`, AccountController.createToken);
router.post("", AccountController.createAccount);
router.get("", AccountController.selectAccounts);
router.get("/:id", AccountController.getAccount);
router.put("/:id", AccountController.updateAccount);
router.delete("/:id", AccountController.deleteAccount);

module.exports = router;
