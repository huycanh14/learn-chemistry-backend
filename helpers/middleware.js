var express = require('express');
var jwt = require('jsonwebtoken');
var config = require('./config.js');
var utils = require('./utils.js');

const LINK_NEXT = [
    process.env.api + process.env.account + process.env.logopt_endpoint, // sign in
    process.env.api + process.env.account + process.env.token_endpoint, // create token
    process.env.api + process.env.account // create account
];

const TokenCheckMiddleware = async (req, res, next) => {
    //Lấy thông tin mã access_token được đính kèm trong request
    
    const access_token = req.headers.access_token || req.query.access_token || req.headers['x-access-token'];
    //kiểm tra có phải đang ở trang router và ở method POST ko -> ko cho kiểm tra token

    if((LINK_NEXT.includes(req.originalUrl)) && req.method === 'POST'){
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
                // console.error(err)
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
