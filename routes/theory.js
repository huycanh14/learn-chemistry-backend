var express = require('express');
var router = express.Router();

var TheoryController = require('../controllers/theory.controller');

router.post('', TheoryController.createTheory);
router.get('', TheoryController.selectTheories);
router.get('/:id', TheoryController.getTheory);
router.put('/:id', TheoryController.updateTheory);
router.put('/:id', TheoryController.updateTheory);
router.delete('/:id', TheoryController.deleteTheory);

module.exports = router;