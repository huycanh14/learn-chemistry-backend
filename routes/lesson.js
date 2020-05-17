var express = require('express');
var router = express.Router();
var lessonService = require('../services/lesson.service');

router.get("", lessonService.GetListLesson);
router.get("/:id", lessonService.GetLesson);
router.post("", lessonService.CreateLesson);
router.put("/:id", lessonService.UpdateLesson);
router.delete("/:delete", lessonService.DeleteLesson);

module.exports = router;
