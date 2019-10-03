var express = require('express');
var router = express.Router();
let gradeLevelService = require('../services/grade_level.service');
const router_config = require('../helpers/router-config.js');

router.get("", gradeLevelService.GetList);
router.post("", gradeLevelService.CreateGradeLevel);
router.get("/:id", gradeLevelService.GetGradeLevel);
router.put("/:id", gradeLevelService.UpdateGradeLevel);
router.delete("/:id", gradeLevelService.DeleteGradeLevel);

module.exports = router;