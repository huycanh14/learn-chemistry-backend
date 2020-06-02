var express = require('express');
var router = express.Router();

var GradeController = require('../controllers/grade.controller');

router.post("", GradeController.createGrade);
router.get("", GradeController.selectGrades);
router.get("/:id", GradeController.getGrade);
router.put("/:id", GradeController.updateGrade);

module.exports = router;