var rq = require('request-promise');
var fs = require('fs');

var date = new Date().toISOString();
var logFileName = '../logs/[CRYPTOBPI]'+date+'errorlog.txt';

function apiRequest(params) {
    var options = {
      uri: `https://api.cryptonator.com/api/full/${params}`,
      json: true,
      resolveWithFullResponse: true
    }
  return rq(options).then((res) => {
    return res;
  }).catch((err) => {
    fs.writeFile(logFileName, err, function(err) {
      if (err) return console.log(err);
      console.log(`[ERROR][CRYPTOBPI]: log created!`);
    });
  });
};

module.exports = {
  apiRequest
};
