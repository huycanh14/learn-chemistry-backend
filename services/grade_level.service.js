var express = require('express');
var gradeLevelModule = require('../modules/grade_level.module');
const router_config = require('../helpers/router-config.js');
const gradeLevelService = {
    GetList, GetGradeLevel, CreateGradeLevel, UpdateGradeLevel, DeleteGradeLevel
}

async function GetList(req, res){
    try{
        /*
        Check have a req.query.get_count => active: total count
        Check have a req.query.page:
            if: request have a select name, activated in req.body
         */
        if(req.query.get_count == 1){
            await gradeLevelModule.count({}, function (err, response) {
                if (err)  return res.status(400).json({'message': err});
                else return res.status(200).json({'count': response});
            })
        } else if(req.query.page){
            let limit = 10;
            let offset = (req.query.page - 1) * 10;
            let name = "";
            if (req.body.name) name = req.body.name;
            let query = [
                {'name': {$regex: name, $options: 'is'}}
            ]
            if(req.body.activated) query.push({'activated': req.body.activated});
            await gradeLevelModule.find({
                $and: query
            }, null,  {limit: limit, skip: offset}, function (err, response) {
                if (err) res.status(400).json({'message': err});
                else res.status(200).json({'data': response});
            })

        } else return res.status(400).json({'message': 'Not query!'});
    } catch (err) {
        return res.status(400).json({
            'message': 'Bad request',
            'error': err
        })
    }
}

async function GetGradeLevel(req, res){
    /*
        Params hava a id: => Get query by id
     */
    try{
        if(req.params.id){
            await gradeLevelModule.findById(req.params.id).exec(function(err, response) {
                if(err) return res.status(400).json({'message': err});
                else return res.status(200).json({'data': response});
            })
        } else return res.status(400).json({'message': 'Not query!'});
    } catch(err) {
        return res.status(400).json({
            'message': "Bad request!",
            'error': err
        });
    }
}

async function CreateGradeLevel(req, res){
    try{
        let grand_level = new gradeLevelModule({
            name: req.body.name,
            created_at: req.body.created_at,
            updated_at: req.body.updated_at,
            activated: req.body.activated,
        });
        grand_level.save(function (err, response) {
            if(err) return res.status(400).json({"message": err});
            else return res.status(200).json({'data': response});
        })
    } catch(err){
        return res.status(400).json({
            'message': "Bad request!",
            'error': err
        });
    }
}

async function UpdateGradeLevel(req, res){
    try{
        if(req.params.id) {
            await gradeLevelModule.findByIdAndUpdate(req.params.id, {$set: req.body},{new: true})
                .exec(function (err, response) {
                    if(err) return res.status(400).json({'messgae': err});
                    else return res.status(200).json({'data': response});
                })
        } else return res.status(400).json({'message': 'Not query!'});
    } catch (err) {
        return res.status(400).json({
            'message': 'Bad request!',
            'error': err
        });
    }
}

async function DeleteGradeLevel(req, res){
    try{
        if(req.params.id){
            await gradeLevelModule.findByIdAndDelete(req.params.id).exec(function (err, response) {
                if(err) return res.status(400).json({'message': err});
                return res.status(200).json({'message': 'Delete successful!'});
            })
        }else return res.status(400).json({'message': 'Not query!'});
    } catch (err) {
        return res.status(400).json({
            'message': "Bad request!",
            'error': err
        })
    }
}

module.exports = gradeLevelService;