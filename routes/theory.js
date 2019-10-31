var express = require("express");
var router = express.Route();
var theoryService = require("../services/theory.service");

router.get("/:lesson_id", theoryService.GetTheory);
router.post("/", theoryService.CreateTheory);
router.put("/:id", theoryService.UpdateTheory);
router.delete("/:id", theoryService.DeleteTheory);

module.exports = router;
