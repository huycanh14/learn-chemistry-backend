var express = require('express');
var router = express.Router();

var ChapterController = require('../controllers/chapter.controller');

router.post("", ChapterController.createChapter);
router.get("", ChapterController.selectChapters);
router.get("/:id", ChapterController.getChapter );
router.put("/:id", ChapterController.updateChapter);

module.exports = router;