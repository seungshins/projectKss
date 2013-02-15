/**
 * CRUD API Test Server Script
 * version : v.1.0
 */

var express = require('express')
  , routes = require('./routes')
  , http = require("http")
  , fs= require('fs')
  , ejs = require('ejs');

var app = module.exports = express.createServer();

var RestHome = require('./webroot/rest/home');

//mongodb setup
var databaseUrl = "dbuser:1234@linus.mongohq.com:10030/TB"; //  "username:password@example.com/mydb"
var db = require('mongoskin').db(databaseUrl); 

app.enable("jsonp callback");

// Configuration
app.configure(function(){
  app.engine('.html', require('ejs').__express);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'html');
  app.use( express.favicon());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.logger()); 
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  app.set("jsonp callback", true);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});


// Routes
app.get('/', function(req, res){
    var userInfo;
    db.collection('TB_USER').find().toArray(function(err, result) {
        if (err) throw err;
        userInfo = result; 
        console.log(result);
        res.render('TestPage', {pageTitle: 'CRUD Demo',userInfo: userInfo});
    });
}); 

//Api handling
app.get('/rest/:apiname', RestHome.process);

app.listen(process.env.C9_PORT || 8001);
//console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);