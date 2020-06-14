var express = require('express');
var router = express.Router();

var ExplainController = require('../controllers/explain.controller');

router.post('', ExplainController.createExplain);
router.get('', ExplainController.selectExplains);
router.get('/:id', ExplainController.getExplain);
router.put('/:id', ExplainController.updateExplain);
router.delete('/:id', ExplainController.deleteExplain);

module.exports = router;