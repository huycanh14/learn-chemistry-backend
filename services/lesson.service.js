var express = require('express');
var router_config = require('../helpers/router-config');
var lessonModule = require('../modules/lesson.module');

const lessonService = {
    GetListLesson, GetLesson, CreateLesson, UpdateLesson, DeleteLesson
}

async function GetListLesson(req, res) {
    try{
        /*
        Check have a req.query.get_count == 1
            if have a query chapter_id => get total by chapter_id
            else get total all
        Check have rea.query.page
            Check: name, description, status, req.query.chapter_id in body => select
         */
        if(req.query.get_count){
            let query = "";
            if (req.query.chapter_id) query = {chapter_id: req.query.chapter_id};
            await lessonModule.count(query).exec(function (err, response) {
                if (err) return res.status(400).json({'message': err});
                else return res.status(200).json({'count': response});
            })
        } else if(req.query.page){
            let limit = 10;
            let offset = (req.query.page - 1) * 10;
            let keyword = "";
            if(req.body.keyword) keyword = req.body.keyword;
            let query = [
                {
                    $or: [
                        {'name': {$regex: keyword, $options: 'is'}},
                        {'description': {$regex: keyword, $options: 'is'}},
                    ]
                }
            ];
            if(req.body.status) query.push({'status': req.body.status});
            if(req.query.chapter_id) query.push({'chapter_id': req.query.chapter_id});
            await lessonModule.find({
                $and: query
            }, null, {limit: limit, skip: offset}, function (err, response) {
                if (err) res.status(400).json({'message': err});
                else res.status(200).json({'data': response});
            });
        } else return res.status(400).json({'message': 'Not query!'});
    } catch (err) {
        return res.status(400).json({
            'message': 'Bad query!',
            'error': err
        })
    }
}

async function GetLesson(req, res){
    try {
        /*
        Check req.params.id => select by id
         */
        if(req.params.id){
            await lessonModule.findById(req.params.id).exec(function (err, response) {
                if(err) return res.status(400).json({'message': err});
                else return res.status(200).json({'data': response});
            })
        } else return res.status(400).json({'message': 'Not request!'});
    } catch (err){
        return res.status(400).json({
            'message': 'Bad request!',
            'error': err
        })
    }
}

async function CreateLesson(req, res){
    try{
        /*
        create lesson = new lessonModule(req.body) => save
         */
        let lesson = new lessonModule({
            name: req.body.name,
            lesson_number: req.body.lesson_number,
            chapter_id: req.body.chapter_id,
            description: req.body.description,
            created_at: req.body.created_at,
            updated_at: req.body.updated_at,
            activated: req.body.activated,
        });
        lesson.save(function (err, response) {
            if(err) return res.status(400).json({'message': err});
            else res.status(200).json({'data': response});
        })
    } catch (err){
        return res.status(400).json({
            'message': 'Bad request!',
            'error': err
        });
    }
}

async function UpdateLesson(req, res){
    /*
    Check have a req.params.id => update
     */
    try{
        if(req.params.id){
            await lessonModule.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true}).exec(function (err, response) {
                if(err) return res.status(400).json({'message': err});
                else return res.status(200).json({'data': response});
            })
        } else return res.status(400).json({'message':'Not request!'});
    } catch (err) {
        return res.status(400).json({
            'message': 'Bad request!',
            'error': err
        })
    }
}

async function DeleteLesson(req, res){
    /*
    Check hava a req.params.id => delete
     */
    try{
        if(req.params.id){
            await lessonModule.findByIdAndDelete(req.params.id).exec(function (err, response) {
                if(err) return res.status(400).json({'message': err});
                else return res.status(200).json({'message': 'Delete successful!'});
            })
        } else return res.status(400).json({'message': 'Not request!'});
    } catch(err){
        return res.status(400).json({
            'message': 'Bad request!',
            'error': err
        })
    }
}

module.exports = lessonService;
