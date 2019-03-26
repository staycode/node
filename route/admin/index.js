const express = require('express');
module.exports = function(){
    var router = express.Router();
    //检查登陆状态
    router.use((req,res,next)=>{
        if(!req.session['session_id'] && req.url!='/login'){
            res.redirect('/admin/login');
        }else {
            next();
        }
    });
    
    router.get('/',(req,res)=>{
        res.render('admin/index.ejs',{});
    });
    
    //banners设置
    router.use('/banners',require('./banners.js')());
    //登陆
    router.use('/login',require('./login.js')());
    //评价
    router.use('/custom',require('./custom.js')());
    return router;
};
