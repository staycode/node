const express = require('express');
const expressStatic = require('express-static');
const urlLib = require('url');
const mysql = require('mysql');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const consolidate = require('consolidate');
const expressRoute = require('express-route');
const bodyParser = require('body-parser');
const multer = require('multer');
const multerObj = multer({
    dest : './static/upload'
});

var server = express();
server.listen(8080);
//1.获取请求数据
server.use(bodyParser.urlencoded({ extended: true}));
server.use(multerObj.any());

//2.cookie、session
server.use(cookieParser());
(function() {
    var keys = [];
    for (var i = 0; i < 10000; i++) {
        keys[i] = 'cc_' + Math.random();
    };
    server.use(cookieSession({
        name : 'session_id',
        keys : keys,
        maxAge : 20 * 60 * 1000
    }))
})();

//3、模板
server.engine('html', consolidate.ejs);
server.set('views', 'template');
server.set('view engine', 'html');

//4、rouer
server.use('/', require('./route/web/index.js')());
server.use('/admin', require('./route/admin/index.js')());

// 
// server.use('/blog', r2);
// r2.get('/a.html', (req, res)=> {
    // res.send('我是博客A页面').end();
// });
// r2.get('/b.html', (req, res)=> {
    // res.send('我是博客B页面').end();
// });

//5.default: static
server.use(expressStatic('./static/'));
