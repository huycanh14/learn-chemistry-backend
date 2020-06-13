var express = require('express');
var router = express.Router();

var QuestionController = require('../controllers/question.controller');

router.post('', QuestionController.createQuestion);
router.get('', QuestionController.selectQuestions);
router.get('/:id', QuestionController.getQuestion);
router.put('/:id', QuestionController.updateQuestion);
router.delete('/:id', QuestionController.deleteQuestion);

module.exports = router;