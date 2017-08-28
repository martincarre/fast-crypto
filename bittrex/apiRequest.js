var rq = require('request-promise');
var fs = require('fs');

var date = new Date().toISOString();
var logFileName = './../logs/[BITTREX]'+date+'errorlog.txt';

function apiRequest(req) {
    var options = {
      uri: `https://bittrex.com/api/v1.1/public/getmarketsummary`,
      qs: req,
      json: true,
      resolveWithFullResponse: true
    }
  return rq(options).then((res) => {
    return res;
  }).catch((err) => {
    fs.writeFile(logFileName, err, function(err) {
      if (err) return console.log(err);
      console.log(`[ERROR][BITTREX]: log created!`);
    });
  });
};

module.exports = {
  apiRequest
};
