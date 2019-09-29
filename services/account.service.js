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
    Login, Token, Create
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
    console.log(refresh_token);
    // con
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
    res.json(req.body);
}

module.exports = accountService;