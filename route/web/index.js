const express = require('express');
const mysql = require('mysql');
const common = require('../../libs/common.js');
const db = common.db();
module.exports = function(){
    var router = express.Router();
    router.get('/get_banners',(req,res)=>{
        db.query(`SELECT * FROM custom`,(err,data)=>{
            if(err){
                console.log(err);
                res.status(500).send('database error').end();
            }else {
                res.send(data).end();
            }
        });
    });
    router.get('/userContact',(req,res)=>{
        var username = req.query.username;
        var Email = req.query.Email;
        var subject = req.query.subject;
        db.query(`INSERT INTO userContact (username,Email,subject) VALUES ('${username}','${subject}','${Email}')`,(err,data)=>{
            if(err){
                console.log(err);
                res.status(500).send('{"ok": false,"msg":"database error"}').end();
            }else {
                res.send('{"ok": true,"msg":"Commit Success"}').end();
            }
        });
    });
    return router;
};