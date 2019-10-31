var express = require("express");
var typeOfLessonMoudle = require("../modules/type_of_lesson.module");

const typeOfLessonService = {
    GetListTypeOfLesson, GetTypeOfLesson, CreateTypeOfLesson, UpdateTypeOfLesson, DeleteTypeOfLesson
}

async function GetListTypeOfLesson(req, res){
    /*
    Get all type of lesson by lesson_id
    if(req.query.lession_id)
        Check have a req.query.get_count:
            true => get total count
            false => list type of lesson by lession_id
     */
    try{
        if(req.query.lesson_id){
            let query = {lesson_id: req.query.lesson_id};
            if(req.query.get_count){
                await typeOfLessonMoudle.count(query).exec(function (err, response) {
                    if(err) return req.status(400).json({"message": err});
                    else return req.status(200).json({"count": response});
                })
            } else{
                await  typeOfLessonMoudle.find(query).exec(function (err, response) {
                    if(err) return req.status(400).json({"message": err});
                    else return req.status(200).json({"data": response});
                })
            }
        } else return res.status(400).json({"message" : "Not request!"})
    } catch (err){
        return res.status(400).json({
            "message": "Bad request!",
            "error": err
        })
    }
}

async function GetTypeOfLesson(req, res){
    /*
        Check have a req.params.id => get type of lesson by id
     */
    try{
        if(req.params.id){
            await typeOfLessonMoudle.findById(req.params.id).exec(function (err, response) {
                if(err) return res.status(400).json({"message": err});
                else return res.status(200).json({"data": response});
            })
        } else return res.status(400).json({"message": "Not request!"});
    } catch (err){
        return res.status(400).json({
            "message": "Bad request!",
            "error": err
        })
    }
}

async function CreateTypeOfLesson(req, res){
    /*
    Create type of lesson
     */
    try{
        let type_of_lesson = new typeOfLessonMoudle({
            title: req.body.title,
            theorie_number: req.body.theorie_number,
            content: req.body.content,
            lesson_id: req.body.lesson_id,
            created_at: req.body.created_at,
            updated_at: req.body.updated_at,
            activated: req.body.activated
        });
        await type_of_lesson.save(function (err, response) {
            if(err) return res.status(400).json({"message": err});
            else return res.status(200).json({"data": response});
        })
    } catch (err){
        return res.status(400).json({
            "message": "Bad request!",
            "error": err
        })
    }
}

async function UpdateTypeOfLesson(req, res){
    /*
    Check have a req.params.id => update
     */
    try{
        if(req.params.id){
            await typeOfLessonMoudle.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true}).exec(function (err, response) {
                if(err) return res.status(400).json({"message": err});
                else return res.status(200).json({"data": response});
            })
        } else return res.status(400).json({"messgae": "Not request!"});
    } catch (err){
        return res.status(400).json({
            "message": "Bad request!",
            "error": err
        })
    }
}

async function DeleteTypeOfLesson(req, res){
    /*
    Check have a req.params.id => delete
     */
    try{
        if(req.params.id){
            await typeOfLessonMoudle.findByIdAndDelete(req.params.id).exec(function (err, response) {
                if(err) return res.status(400).json({"message": err});
                else return res.status(200).json({"message": "Delete successful!"});
            })
        } else return res.status(400).json({"message": "Not request!"});
    } catch (err){
        return res.status(400).json({
            "message": "Bad request!",
            "error": err
        })
    }
}

module.exports = typeOfLessonService;
