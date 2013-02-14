/**
 * All request will be received in this page.
 */
var projconstants = require('../commons/constants');
var restHome = require('../webroot/rest/home');

/*
 * GET home page.
 */

exports.index = function(req, res){
  var reqUrl = req.url;
  console.info('request url : ' + reqUrl);

  // 현재 context root가 rest 하나 이지만, 추후 변경 필요시 수정
  // request url 이 /rest ~ 일 경우만 분기 처리

  try {
    if (reqUrl.split('\/')[1] === projconstants.contextRoot.rest) {
      // restHome.rest(req, res);
    } else {
      res.render('index', { title: 'unknown page.' });
    }

  } catch (err) {
    console.dir(err);
    res.render('index', { title: 'unknown page.' });
  }

};