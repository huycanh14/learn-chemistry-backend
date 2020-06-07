var express = require('express');
var router = express.Router();

var ChapterController = require('../controllers/chapter.controller');

router.post("", ChapterController.createChapter);

module.exports = router;