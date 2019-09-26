var express = require("express");
const bcrypt = require("bcrypt");
var accountModule = require("../modules/account.module.js");

const accountService = {
    Login
}

function Login(account){
    if(account.email)
    accountModule.find({
        'email': account.email,
        'password' : account.password
    });
    var salt = bcrypt.genSaltSync(12)
    var hash = bcrypt.hashSync(account.password, salt);
    var test = bcrypt.compareSync(account.password, hash);
    return test;
    // var hash = bcrypt.hashSync(password', salt)
}

module.exports = accountService;