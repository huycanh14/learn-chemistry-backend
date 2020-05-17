var exampleExerciseModule = require("../modules/example_exercise.module");

const exampleExerciseService = {
    GetListExampleExercise
}

async function GetListExampleExercise(req, res){
    /*
    Check hava a req.query.type_of_lesson_id
    if hava a req.query.get_count => get total count
    else get all example exercise by type of lession id
     */
    try{
        if(req.query.type_of_lesson_id){
            let query = {type_of_lesson_id: req.query.type_of_lesson_id};
            if(req.query.get_count){
                await exampleExerciseModule.count(query).exec(function (err, response) {
                    if(err) return res.status(400).json({"message": err});
                    else return res.status(200).json({"count": response});
                });
            } else {
                await exampleExerciseModule.find(query, null, function (err, response) {
                    if(err) return res.status(400).json({"message": err});
                    else return res.status(200).json({"data": response});
                })
            }
        } else return res.status(400).json({"message": "Not request!"});
    } catch (err) {
        return res.status(400).json({
            "message": "Bad request!",
            "error": err
        })
    }
}

module.exports = exampleExerciseService;
