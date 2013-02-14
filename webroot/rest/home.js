var projconstants = require('../../commons/constants');

exports.process = function(req, res) {
  try {
    _routeReq(req, res);
  } catch (err) {
    console.dir(err);
    res.render('index', { title: 'unknown page.' });
  }
};

function _routeReq(req, res) {
  _switchApiName(req, res);
}

function _switchApiName(req, res) {
  try {
    var apiName = req.params.apiname;
    console.log("apiName : " + apiName);
    if (apiName === 'createUser') {
        createUser(req, res);
    } else if(apiName === 'retrieveAllUser'){
        retrieveAllUser(req, res);           
    } else if(apiName === 'retrieveUserById'){
        retrieveUserById(req, res);    
    } else if(apiName === 'updateUser'){
        updateUser(req, res); 
    } else if(apiName === 'deleteUser'){
        deleteUser(req, res);
    } else {
      res.send('Unknown page', 404);
    }
  } catch (err) {
    res.send('Internal Server Error.\n', 500);
  }
}

/*
 * mongoskin setting
 */
var databaseUrl ="dbuser:1234@linus.mongohq.com:10030/TB"; //  "username:password@example.com/mydb"
var db = require('mongoskin').db(databaseUrl); 

/**
 * TB_USER 테이블에 User 추가
 */
function createUser(req, res){
    var user_id = req.query.user_id;
    var password = req.query.password;
    console.log("user_id : " + user_id);
    console.log("password : " + password);
    
    var resCode;
    var returnData = {};
    
    //user_id is null
    if(user_id === null || user_id === undefined || user_id === ""){
        resCode = "01";
        returnData.resCode = resCode;
        res.send(req.query.callback + '('+ JSON.stringify(returnData) + ');');
        return;
    }else if(password === null || password === undefined || password === ""){
        resCode = "03";
        returnData.resCode = resCode;
        res.send(req.query.callback + '('+ JSON.stringify(returnData) + ');');
        return;
    }else{
        db.collection('TB_USER').find({'user_id' : user_id}).toArray(function(err, result) {
            if(err){
              throw err; 
            }
            if(result !== null && result.length > 0){
                console.log("already exist");
                resCode = "02";
                returnData.resCode = resCode;
                res.send(req.query.callback + '('+ JSON.stringify(returnData) + ');');
                return;
            }else{
                db.collection('TB_USER').insert({
                    user_id: user_id,
                    password: password
                }, {safe : true}, function(err, result){
                    if (err) 
                        throw err;
                    if (result){     
                        var resCode = "00";
                        var returnData = {};
                        returnData.resCode = resCode;
                        returnData.resData = result;
                        console.log(req.query.callback + '('+ JSON.stringify(returnData)+ ');');
                        res.send(req.query.callback + '('+ JSON.stringify(returnData) + ');');
                    }
                });
            }
            console.log(JSON.stringify(result));
        });
    }
}

/**
 * TB_USER 테이블에 모든 User 조회하기
 */
function retrieveAllUser(req, res){
    db.collection('TB_USER').find().toArray(function(err, result) {
        if(err){
          throw err; 
        }
        var resCode = "00";
        var returnData = {};
        returnData.resCode = resCode;
        returnData.resData = result;
        console.log(req.query.callback + '('+ JSON.stringify(returnData)+ ');');
        res.send(req.query.callback + '('+ JSON.stringify(returnData) + ');');
    });  
}

/**
 * TB_USER 테이블에 User_id로 User 조회하기
 */
function retrieveUserById(req,res){
    var user_id = req.query.user_id;
    console.log("user_id ddd : " + user_id);
    
    //user_id is null
    if(user_id === null || user_id === undefined || user_id === ""){
        var resCode = "01";
        var returnData = {};
        returnData.resCode = resCode;
        res.send(req.query.callback + '('+ JSON.stringify(returnData) + ');');
        return;
    }
    
    db.collection('TB_USER').find({'user_id' : user_id}).toArray(function(err, result){
        if(err){
          throw err; 
        }
        var resCode = "00";
        var returnData = {};
        returnData.resCode = resCode;
        returnData.resData = result;
        console.log(req.query.callback + '('+ JSON.stringify(returnData)+ ');');
        res.send(req.query.callback + '('+ JSON.stringify(returnData) + ');');
    });
}

/**
 * TB_USER 테이블에 Update하기 
 */
 function updateUser(req, res){
    var user_id = req.query.user_id;
    var password = req.query.password;
    console.log("user_id : " + user_id);
    console.log("password : " + password);
    
    var resCode;
    var returnData = {};
    
    //user_id is null
    if(user_id === null || user_id === undefined || user_id === ""){
        resCode = "01";
        returnData.resCode = resCode;
        res.send(req.query.callback + '('+ JSON.stringify(returnData) + ');');
        return;
    }else if(password === null || password === undefined || password === ""){
        resCode = "03";
        returnData.resCode = resCode;
        res.send(req.query.callback + '('+ JSON.stringify(returnData) + ');');
        return;
    }else{
        db.collection('TB_USER').update({'user_id' : user_id}, {'user_id' : user_id, 'password': password}, {safe:true}, function(err, result){
            if(err){
                throw err;
            }else{
                resCode = "00";
                returnData.resCode = resCode;
                console.log(req.query.callback + '('+ JSON.stringify(returnData)+ ');');
                res.send(req.query.callback + '('+ JSON.stringify(returnData) + ');');
            }
        });
    }
 }
 
 /**
  * TB_USER 테이블에서 Delete 하기
  */
function deleteUser(req, res){
    var user_id = req.query.user_id;
    var password = req.query.password;
    console.log("user_id : " + user_id);
    console.log("password : " + password);
    
    var resCode;
    var returnData = {};
    
    //user_id is null
    if(user_id === null || user_id === undefined || user_id === ""){
        resCode = "01";
        returnData.resCode = resCode;
        res.send(req.query.callback + '('+ JSON.stringify(returnData) + ');');
        return;
    }else{
         db.collection('TB_USER').remove({'user_id' : user_id}, {safe:true}, function(err, result){
            if(err){
                throw err;
            }else{
                resCode = "00";
                returnData.resCode = resCode;
                console.log(req.query.callback + '('+ JSON.stringify(returnData)+ ');');
                res.send(req.query.callback + '('+ JSON.stringify(returnData) + ');');
            }
        });
    }
}

 