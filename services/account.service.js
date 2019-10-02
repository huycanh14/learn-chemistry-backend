var express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var accountModule = require("../modules/account.module.js");
const router_config = require('../helpers/router-config.js');
const config = require("../helpers/config.js");
var tokenList = {};
const utils = require("../helpers/utils.js");
const salt = bcrypt.genSaltSync(12);

const accountService = {
    Login, Token, Create, Select, GetAccount, UpdateAccount, DeleteAccount
}

async function Login(req, res) {
    var account = req.body;
    var data = await accountModule.findOne({
        $or:[
            {'email': account.user_name},
            {'username': account.user_name,}
        ]
    }, function (err, request) {
        return request;
    });
    if(data){
        const refresh_token = jwt.sign({data: data}, config.refreshTokenSecret, {
            expiresIn: config.tokenLife
        });
        // var test = bcrypt.compareSync(hash, data.password);
        var check_password = bcrypt.compareSync(account.password, data.password);
        if(check_password){
            tokenList[refresh_token] = data;
            var response = data;
            response.password = undefined;
            response = JSON.parse(JSON.stringify(response));
            response.refresh_token = refresh_token;
            res.json(response);
        } else {
            res.status(401).json({
                message: "Wrong login credential"
            });
        }
    } else{
        res.status(401).json({
            message: "Wrong login credential"
        });
    }
}

async function Token(req, res){
    const { refresh_token } = req.headers;
    if((refresh_token) && (refresh_token in tokenList)){
        try {
            // Kiểm tra mã refresh_token
            await utils.verifyJwtToken(refresh_token, config.refreshTokenSecret);
            //Lấy lại thông tin user
            const user = tokenList[refresh_token];
            //Tạo mới mã token và trả lại cho user
            const access_token = jwt.sign({data: user}, config.secret, {
                expiresIn: config.tokenLife,
            });
            var response = user;
            response.password = undefined;
            response = JSON.parse(JSON.stringify(response));
            response.access_token = access_token;
            res.status(200).json(response);
        } catch (err) {
            console.error(err);
            res.status(403).json({
                message: "Invalid refresh token"
            })
        }
    } else {
        res.status(400).json({
            message: 'Invalid request',
        });
    }
}

async function Create(req, res){
    try{
        let password = bcrypt.hashSync(req.body.password, salt);
        let account = new accountModule({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            username: req.body.username,
            email: req.body.email,
            date_of_birth: req.body.date_of_birth,
            gender: req.body.gender,
            password: password,
            role_id: req.body.role_id,
            created_at: req.body.created_at,
            updated_at: req.body.updated_at,
            activated: req.body.activated
        });
        account.save(function (err, response) {
            if(err){
                return res.status(400).json({'message': err});
            } else {
                response.password = undefined;
                response = JSON.parse(JSON.stringify(response));
                return res.status(200).json({'data': response});
            }
        })
    } catch (err) {
        return res.status(400).json({
            'message': 'Bad Request',
            'error': err
        });
    }

}

async function Select(req, res){
    try {
        let limit = 10;
        let offset = 0;
        if (req.query.page) {
            offset = (req.query.page - 1) * 10;
            let keyword = "";
            if (req.body.keyword) keyword = req.body.keyword;
            let query = [
                {
                    $or: [
                        {'first_name': {$regex: keyword, $options: 'is'}},
                        {'last_name': {$regex: keyword, $options: 'is'}},
                        {'username': {$regex: keyword, $options: 'is'}},
                    ]
                }
            ];
            if (req.body.gender) query.push({'gender': req.body.gender});
            if (req.body.activated) query.push({'activated': req.body.activated});
            if (req.body.role_id) query.push({'role_id': req.body.role_id});
            try {
                await accountModule.find({
                    $and: query
                }, '-password', {limit: limit, skip: offset}, function (err, response) {
                    if (err) res.status(400).json({'message': err});
                    else res.status(200).json({'data': response});
                });
            } catch (e) {
                return res.status(400).json({'message': e});
            }
        } else if (req.query.get_count == 1) {
            await accountModule.count({}, function (err, response) {
                if (err) {
                    return res.status(400).json({'message': err});
                } else {
                    return res.status(200).json({'count': response});
                }
            })
        }
    }catch (err) {
        return res.status(400).json({
            'message': 'Bad Request',
            'error': err
        });
    }
}

async function GetAccount(req, res){
    try{
        if(req.params.id){
            let id = req.params.id;
            await accountModule.findById(id).select('-password').exec(function (err, response) {
                if(err) return res.status(400).json({'message': err});
                else return res.status(200).json({'data': response});
            });
        }
    } catch (err) {
        return res.status(400).json({
            'message': 'Bad Request',
            'error': err
        });
    }
}

async function UpdateAccount(req, res){
    try{
        if(req.body.current_password){
            await accountModule.findById(req.params.id).exec(function (err, response) {
                if(err) return res.status(400).json({'message': err});
                else {
                    var check_password = bcrypt.compareSync(req.body.password, response.password);
                    if(check_password) {
                        let password = bcrypt.hashSync(req.body.password, salt);
                        accountModule.findByIdAndUpdate(req.params.id, {$set:{'password': password}}, {new: true})
                            .select('-password')
                            .exec(function (err, response) {
                                if(err) return res.status(400).json({'message': err});
                                else {
                                    return res.status(200).json({'data': response});
                                }
                            });
                    }else return res.status(400).json({"message": "Password is true!"});
                }
            })
        }else{
            let account = req.body;
            await accountModule.findByIdAndUpdate(req.params.id,{$set: account},{new: true})
                .select('-password')
                .exec(function (err, response) {
                    if(err) return res.status(400).json({'message': err});
                    else {
                        return res.status(200).json({'data': response});
                    }
                });
        }
    } catch (err) {
        return res.status(400).json({
            'message': 'Bad Request',
            'error': err
        });
    }

}

async function DeleteAccount(req, res){
    try{
        if(req.params.id){
            await accountModule.findByIdAndDelete(req.params.id).exec(function (err, response) {
                if(err) return res.status(400).json({'message': err});
                else {
                    return res.status(200).json({'message': 'Delete successful!'});
                }
            });
        }
    } catch (err) {
        return res.status(400).json({
            'message': 'Bad Request',
            'error': err
        });
    }
}
module.exports = accountService;