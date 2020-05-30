var express = require('express');
var router = express.Router();

var GradeServer = require('../services/grade.service');

router.post("", GradeServer.createGrade);
router.get("", GradeServer.selectGrades);
router.get("/:id", GradeServer.getGrade);
router.put("/:id", GradeServer.updateGrade);

module.exports = router;