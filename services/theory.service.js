var express = require("express");
var router_config = require("../helpers/router-config");
var theoryModule = require("../modules/theory.module");

const theoryService = {
    GetTheory, CreateTheory, UpdateTheory, DeleteTheory
}

async function GetTheory(req, res) {
    /*
    Check req.params.lesson_id => get theory
    relationship (lession and theory) = 1 - 1
     */
    try{
        if(req.params.lesson_id){
            await theoryModule.findOne({
                lesson_id: req.params.lesson_id
            }, null, function (err, response) {
                if(err) return res.status(400).json({'message': err});
                else return res.status(200).json({'data': response});
            })
        } else return res.status(400).json({'message': 'Not request!'});
    } catch(err){
        return res.status(400).json({
            'message': "Bad request!",
            "error": err
        })
    }
}

async function CreateTheory(req, res) {
    /*
    Create theory
     */
    try{
        let theory = new theoryModule({
            content: req.body.content,
            lesson_id: req.body.lesson_id,
            lesson_id: req.body.lesson_id,
            updated_at: req.body.updated_at,
            activated: req.body.activated,
        });
        await theory.save(function (err, response) {
            if(err) return res.status(400).json({"message": err});
            else return res.status(200).json({"data": response});
        })
    } catch (err) {
        return res.status(400).json({
            'message': "Bad request!",
            'error': err
        })
    }
}

async function UpdateTheory(req, res) {
    /*
    Check have a req.params.id (id of theory) => Update
     */
    try{
        if(req.params.id){
            await theoryModule.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true}).exec(function (err, response) {
                if(err) return res.status(400).json({"message": err});
                else return res.status(200).json({"data": response});
            })
        } else return res.status(400).json({'message': 'Not request!'});
    }catch (err) {
        return res.status(400).json({
            'message': "Bad request!",
            "error": err
        })
    }
}

async function DeleteTheory(req, res) {
    /*
    Check hava a req.params.id (id of theory) => Delete
     */
    try{
        if(req.params.id){
            await theoryModule.findByIdAndDelete(req.params.id).exec(function (err, response) {
                if(err) return res.status(400).json({"message": err});
                else return res.status(200).json({"message": "Delete successful!"})
            })
        } else return res.status(400).json({"mesage": "Not request!"});
    } catch(err){
        return res.status(400).json({
            "message": "Bad request!",
            "error": err
        })
    }
}
