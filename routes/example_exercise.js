var express = require("express");
var router = express.Router();
var exampleExerciseService = require("../services/example_exercise.service");

router.get("/", exampleExerciseService.GetListExampleExercise);

module.exports = router;
