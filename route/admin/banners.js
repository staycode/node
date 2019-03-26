const express = require('express');
const mysql = require('mysql');
var common = require('../../libs/common.js');
const db = common.db();
module.exports = function(){
    var router = express.Router();
    router.get('/',(req,res)=>{
        switch(req.query.act){
            case 'mod':
                db.query(`SELECT * FROM banners WHERE id = '${req.query.id}'`,(err,mod_data)=>{
                    if(err){
                        console.error(err);
                        res.status(500).send('database error').end();
                    }else if(mod_data.length == 0){
                        res.status(400).send('datas are not found').end();
                    }else {
                        db.query(`SELECT * FROM banners`,(err,data)=>{
                            if(err){
                                console.error(err);
                                res.status(500).send('database error').end();
                            }else{
                                res.render('admin/banners.ejs',{data,mod_data: mod_data[0]});
                            }
                        });
                    }
                });
                break;
            case 'del':
                db.query(`DELETE FROM banners WHERE id = '${req.query.id}'`,(err,data)=>{
                    if(err){
                        console.error(err);
                        res.status(500).send('database error').end();
                    }else{
                        res.redirect('/admin/banners');
                    }
                });
                break;
            default:
                db.query(`SELECT * FROM banners`,(err,data)=>{
                    if(err){
                        console.error(err);
                        res.status(500).send('database error').end();
                    }else{
                        //console.log(data);
                        if(data.length==0){
                            res.status(400).send('no datas').end();
                        }else {
                            res.render('admin/banners.ejs',{data});
                        }
                    }
                });
                break;
        }
    });
    
    router.post('/',(req,res)=>{
        //console.log(req.body);
        var title= req.body.title;
        var description = req.body.description;
        var href = req.body.href;
        if(!title || !description ||!href){
            res.status(400).send('arg error').end();
        }else if(!req.body.mod_id){
            db.query(`INSERT INTO banners (title,description,href) VALUE ('${title}','${description}','${href}')`,(err,data)=>{
                if(err){
                    console.error(err);
                    res.status(500).send('database error').end();
                }else{
                    //console.log(data);
                    if(data.length==0){
                        res.status(400).send('no this admin').end();
                    }else {
                        res.redirect('/admin/banners');
                    }
                }
            });
        }else {
            db.query(`UPDATE banners SET title='${req.body.title}',description='${req.body.description}',href='${req.body.href}' WHERE id='${req.body.mod_id}'`,(err,data)=>{
                if(err){
                    console.error(err);
                    res.status(500).send('database error').end();
                }else{
                    res.redirect('/admin/banners');
                }
            });
        }
    });
    return router;
}
