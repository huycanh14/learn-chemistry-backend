var express = require('express');
var router_config = require('../helpers/router-config');
var chapterModule = require('../modules/chapter.module');

const chapterService = {
    GetListChapter, GetChapter, CreateChapter, UpdateChapter, DeleteChapter
}

async function GetListChapter(req, res){
    /*
        Check have a req.query.get_count => get total count
        Check have a get total count by grade_level (req.query.grade_level_id) => get total count by grade_level_id
        Check have a req.query.page, req.query.grade_level_id
            find by ~ name, activated
     */
    try{
        if(req.query.get_count == 1){
            let query = {};
            if(req.query.grade_level_id) query = {_id: req.query.grade_level_id};
            await chapterModule.count(query, function (err, response) {
                if(err) return res.status(400).json({"message": err});
                else return res.status(200).json({'count': response});
            })
        } else if(req.query.page){
            let limit = 10;
            let offset = (req.query.page - 1) * 10;
            let name = "";
            if (req.body.name) name = req.body.name;
            let query = [
                {'name': {$regex: name, $options: 'is'}}
            ];
            if(req.query.grade_level_id) query.push({'_id': req.query.grade_level_id});
            if(req.body.activated) query.push({'activated': req.body.activated});
            await chapterModule.find({
                $and: query
            }, null,  {limit: limit, skip: offset}, function (err, response) {
                if (err) res.status(400).json({'message': err});
                else res.status(200).json({'data': response});
            });
        }else return res.status(400).json({'message': 'Not query!'});
    } catch(err){
        res.status(400).json({
            'message': "Bad request!",
            'error': err
        })
    }
}

async function GetChapter(req, res){
    /*
        Check req.prams.id => Get by id
     */
    try{
        if(req.params.id){
            await chapterModule.findById(req.params.id).exec(function (err, response) {
                if(err) return res.status(400).json({'message': err});
                else return res.status(200).json({'data': response});
            })
        }else return res.status(400).json({'message': 'Not query!'});
    } catch(err){
        return res.status(400).json({
            'message': 'Bad request!',
            'error': err
        })
    }
}

async function CreateChapter(req, res){
    /*
    assign value: let chapter = new chapterModule with value = req.body => save
     */
    try{
        let chapter = new chapterModule({
            name: req.body.name,
            chapter_number: req.body.chapter_number,
            grade_level_id: req.body.grade_level_id,
            description: req.body.description,
            created_at: req.body.created_at,
            updated_at: req.body.updated_at,
            activated: req.body.activated,
        });
        chapter.save(function (err, response) {
            if(err) return res.status(400).json({'message': err});
            else return res.status(200).json({'data': response});
        })
    } catch (err) {
        return res.status(400).json({
            'message': 'Bad request!',
            'error': err
        });
    }
}

async function UpdateChapter(req, res){
    /*
    Check have a req.params.id => update
     */
    try{
        if(req.params.id){
            await chapterModule.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true}).exec(function (err, response) {
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

async function DeleteChapter(req, res){
    /*
    Check req.params.id => delete
     */
    try{
        if(req.params.id){
            await chapterModule.findByIdAndDelete(req.params.id).exec(function (err, response) {
                if(err) return res.status(400).json({'message': err});
                else return res.status(200).json({'message': 'Delete successful!'})
            })
        } else return res.status(400).json({'message': 'Not request!'});
    }catch (err) {
        return res.status(400).json({
            'message': 'Bad request!',
            'error': err
        });
    }
}

module.exports = chapterService;
