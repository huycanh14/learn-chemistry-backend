var express = require("express");
const jwt = require("jsonwebtoken");
let config = require("./config.js");
const utils = require("./utils.js");
const router_config = require('../helpers/router-config.js');

const TokenCheckMiddleware = async (req, res, next) => {
    //Lấy thông tin mã access_token được đính kèm trong request
    // const access_token = req.body.access_token || req.query.access_token || req.headers['x-access-token'];
    const access_token = req.headers.access_token || req.query.access_token || req.headers['x-access-token'];
    //kiểm tra có phải đang ở trang router và ở method POST ko -> ko cho kiểm tra token
    // console.log(req)
    if(req.path === (router_config.api + router_config.account.url + router_config.account.logopt_endpoint) && req.method === 'POST'){
        next();
    } else if(req.path === (router_config.api + router_config.account.url + router_config.account.token_endpoint) && req.method === 'POST'){
        next();
    } else {

        //decode token
        if (access_token) {
            //Xác nhận mã access_token và kiểm tra thời hạn của mã
            try {
                const decode = await utils.verifyJwtToken(access_token, config.secret);
                //lưu thông tin giã mã được vào đối tượng req, dùng cho các xử lý ở sau
                req.decode = decode;
                next();
            } catch (err) {
                //Giải mã gặp lỗi: Không đúng, hết hạn....
                console.error(err)
                return res.status(401).json({
                    message: "Unauthorized access."
                });
            }
        } else {
            // không tìm thấy access_token trong request
            return res.status(403).send({
                message: "No token provided",
            });
        }
    }
}

module.exports = TokenCheckMiddleware;