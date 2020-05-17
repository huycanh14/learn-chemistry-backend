var express = require("express");
var router = express.Router();
var typeOfLessonSevice = require("../services/type_of_lesson.service");

router.get("", typeOfLessonSevice.GetListTypeOfLesson);
router.get("/:id", typeOfLessonSevice.GetTypeOfLesson);
router.post("", typeOfLessonSevice.CreateTypeOfLesson);
router.put("/:id", typeOfLessonSevice.UpdateTypeOfLesson);
router.delete("/:id", typeOfLessonSevice.DeleteTypeOfLesson);

module.exports = router;
