const express = require('express');
const crypto = require('crypto');
const mysql = require('mysql');
const fs = require('fs');
const pathLib = require('path');
module.exports = {
    MD5_SUFFIX : 'sdfsadrgsfghsfgfe4tw43t23bfgs',
    md5 : function(str) {
        var obj = crypto.createHash('md5');
        obj.update(str);
        return obj.digest('hex');
    },
    creteRouter : function(routerName) {
        var router = express.Router();
        switch(routerName) {
        case 'article':
            router.get('/a.html', function(req, res) {
                res.send('我是A页面').end();
            });
            router.get('/b.html', function(req, res) {
                res.send('我是B页面').end();
            });
            break;
        case 'blog':
            router.get('/1.html', function(req, res) {
                res.send('我是A页面').end();
            });
            router.get('/2.html', function(req, res) {
                res.send('我是B页面').end();
            });
            break;
        default:
        }
        return router;
    },
    db : function() {
        return mysql.createPool({
            host : 'localhost',
            user : 'root',
            password : '123456',
            database : 'node_practice'
        })
    },
    renameImgSrc: function(originalname,path){
        var ext = pathLib.parse(originalname).ext;
        var newPath = path+ext;
        fs.rename(path,newPath,(err)=>{
            
        })
    }
}

