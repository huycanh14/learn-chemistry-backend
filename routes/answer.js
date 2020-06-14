var express = require('express');
var router = express.Router();

var AnswerController = require('../controllers/answer.controller');

router.post('', AnswerController.createAnswer);
router.get('', AnswerController.selectAnswers);
router.get('/:id', AnswerController.getAnswer);
router.put('/:id', AnswerController.updateAnswer);
router.delete('/:id', AnswerController.deleteAnswer);

module.exports = router;