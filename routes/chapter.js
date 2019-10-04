var express = require('express');
var router = express.Router();
var chapterService = require('../services/chapter.service');
var router_config = require('../helpers/router-config');

router.get("", chapterService.GetListChapter);
router.post("", chapterService.CreateChapter);
router.get("/:id", chapterService.GetChapter);
router.put("/:id", chapterService.UpdateChapter);
router.delete("/:id", chapterService.DeleteChapter);

module.exports = router;
