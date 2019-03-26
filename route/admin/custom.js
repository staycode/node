const express = require('express');
const mysql = require('mysql');
const common = require('../../libs/common.js');
const db = common.db();
const fs = require('fs');
const pathLib = require('path');
module.exports = function(){
    var router = express.Router();
    router.get('/',(req,res)=>{
        switch(req.query.act){
            case 'del':
                db.query(`SELECT * FROM custom WHERE id = '${req.query.id}'`,(err,data)=>{
                    if(err){
                        console.log(err);
                        res.status(500).send('database error').end();
                   }else{
                       if(data.length==0){
                           res.status(404).send('no this custom').end();
                       }else {
                           if(data[0].src != "null"){
                               fs.unlink('static/upload/'+data[0].src,(err)=>{
                                   if(err){
                                       console.log(err);
                                       res.status(500).send('file operation failed').end();
                                   }else {
                                       db.query(`DELETE  FROM custom WHERE id=${req.query.id}`,(err,data)=>{
                                           if(err){
                                               console.log(err);
                                               res.status(500).send('database err').end();
                                           }else{
                                               res.redirect('/admin/custom');
                                           }
                                       });
                                   }
                               });
                           }else {
                               db.query(`DELETE  FROM custom WHERE id=${req.query.id}`,(err,data)=>{
                                   if(err){
                                       console.log(err);
                                       res.status(500).send('database err').end();
                                   }else{
                                       res.redirect('/admin/custom');
                                   }
                               });
                           }
                       }
                   }
                });
                break;
            case 'mod':
                db.query(`SELECT * FROM custom WHERE id = '${req.query.id}'`,(err,mod_data)=>{
                    if(err){
                        console.error(err);
                        res.status(500).send('database error').end();
                    }else if(mod_data.length == 0){
                        res.status(400).send('datas are not found').end();
                    }else {
                        db.query(`SELECT * FROM custom`,(err,data)=>{
                            if(err){
                                console.error(err);
                                res.status(500).send('database error').end();
                            }else{
                                res.render('admin/custom.ejs',{data,mod_data: mod_data[0]});
                            }
                        });
                    }
                });
                break;
            default:
                db.query(`SELECT * FROM custom`,(err,data)=>{
                   if(err){
                       res.status(500).send('database err').end();
                   }else{
                       res.render('admin/custom.ejs',{data});
                   }
               });
               break;
        }
    });
    
    router.post('/',(req,res)=>{
       var title = req.body.title;
       var description = req.body.description;
       var fileObj = req.files;
       console.log(fileObj);
       if(req.files[0]){
           //上传了文件
           var oldpath = fileObj[0].path;
           var ext = pathLib.parse(fileObj[0].originalname).ext;
           var newpath = oldpath + ext;
           var newFileName = fileObj[0].filename + ext;
           console.log(newpath);
           fs.rename(oldpath,newpath,(err)=>{
               if(err){
                    res.status(500).send('file operation failed');
                }else{
                    if(req.body.mod_id){
                       //修改
                       db.query(`SELECT * FROM custom WHERE id = '${req.body.mod_id}'`,(err,data)=>{
                            if(err){
                                console.log(err);
                                res.status(500).send('database error').end();
                           }else{
                               if(data.length==0){
                                   res.status(404).send('no this custom').end();
                               }else {
                                   console.log(typeof(data[0].src))
                                   console.log(data[0].src)
                                   if(data[0].src != "null"){
                                       console.log('111')
                                       fs.unlink('static/upload/'+data[0].src,(err)=>{
                                           if(err){
                                               console.log(err);
                                               res.status(500).send('file operation failed').end();
                                           }else {
                                               db.query(`UPDATE custom SET title = '${title}',description = '${description}',src = '${newFileName}' WHERE id='${req.body.mod_id}'`,(err,data)=>{
                                                   if(err){
                                                       console.log(err);
                                                       res.status(500).send('database error').end();
                                                   }else {
                                                       res.redirect('/admin/custom');
                                                   }
                                               });
                                           }
                                       });
                                   }else {
                                       console.log(data[0].src)
                                       db.query(`UPDATE custom SET title = '${title}',description = '${description}',src = '${newFileName}' WHERE id='${req.body.mod_id}'`,(err,data)=>{
                                           if(err){
                                               console.log(err);
                                               res.status(500).send('database error').end();
                                           }else {
                                               res.redirect('/admin/custom');
                                           }
                                       });
                                   }
                               }
                           }
                        });
                   }else {
                       //添加
                       db.query(`INSERT INTO custom SET title = '${title}',src = '${newFileName}',description = '${description}'`,(err,data)=>{
                           if(err){
                               console.log(err);
                               res.status(500).send('database error').end();
                           }else {
                               res.redirect('/admin/custom');
                           }
                       });
                   }
                }
           })
       }else {
           var newFileName = null;
           if(req.body.mod_id){
               //修改
               db.query(`UPDATE custom SET title = '${title}',description = '${description}' WHERE id='${req.body.mod_id}'`,(err,data)=>{
                   if(err){
                       console.log(err);
                       res.status(500).send('database error').end();
                   }else {
                       res.redirect('/admin/custom');
                   }
               });
               
           }else {
               //添加
               db.query(`INSERT INTO custom (title,description,src) VALUE ('${title}','${description}','${newFileName}')`,(err,data)=>{
                   if(err){
                       console.log(err);
                       res.status(500).send('database error').end();
                   }else {
                       res.redirect('/admin/custom');
                   }
               });
           }
       }
    });
    return router;
}
