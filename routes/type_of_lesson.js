var express = require('express');
var router = express.Router();

var TypeOfLessonController = require('../controllers/type_of_lesson.controller');

router.post('', TypeOfLessonController.createTypeOfLesson);
router.get('', TypeOfLessonController.selectTypeOfLessons);
router.get('/:id', TypeOfLessonController.getTypeOfLesson);
router.put('/:id', TypeOfLessonController.updateTypeOfLesson);
router.delete('/:id', TypeOfLessonController.deleteTypeOfLesson);

module.exports = router;