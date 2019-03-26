const express = require('express');
const mysql = require('mysql');
var common = require('../../libs/common.js');
const db = common.db();
module.exports = function(){
    var router = express.Router();
    router.get('/',(req,res)=>{
        res.render('admin/login.ejs',{});
    });
    router.post('/',(req,res)=>{
        //console.log(req.body);
        var username= req.body.username;
        var password= common.md5(req.body.password+'sdfsadrgsfghsfgfe4tw43t23bfgs');
        //console.log(password);
        db.query(`SELECT * FROM admin WHERE username = '${username}'`,(err,data)=>{
            if(err){
                console.error(err);
                res.status(500).send('database error').end();
            }else{
                //console.log(data);
                if(data.length==0){
                    res.status(400).send('no this admin').end;
                }else {
                    if(data[0].password == password){
                        req.session['session_id']=data[0].id;
                        res.redirect('/admin/');
                    }else {
                        res.status(400).send('wrong password').end();
                    }
                }
            }
        });
    });
    return router;
}
