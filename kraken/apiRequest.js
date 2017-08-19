var rq = require('request-promise');
var fs = require('fs');

function apiRequest(params, req) {
  var date = new Date().toISOString();
  var logFileName = '../logs/[KRAKEN]'+date+'errorlog.txt';
    var options = {
      uri: `https://api.kraken.com/0/public/${params}`,
      qs: req,
      json: true,
      resolveWithFullResponse: true
    };
  return rq(options).then((res) => {
    if (res.statusCode === 200 && !res.body.error.length) {
      return res;
    } else {
      fs.writeFile(logFileName, res, function(err) {
        if (err) return console.log(err);
        console.log(`[ERROR][KRAKEN]: log created!`);
      });
    }
  }).catch((err) => {
    fs.writeFile(logFileName, err, function(err) {
      if (err) return console.log(err);
      console.log(`[ERROR][KRAKEN]: log created!`);
    });
  });
};


module.exports = {
  apiRequest
};
