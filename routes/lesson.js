var express = require('express');
var router = express.Router();

var LessonController = require('../controllers/lesson.controller');

router.post("", LessonController.createLesson);
router.get("", LessonController.selectLessons);
router.get("/:id", LessonController.getLesson);
router.put("/:id", LessonController.updateLesson);
router.delete("/:id", LessonController.deleteLesson);

module.exports = router;