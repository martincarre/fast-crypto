var rq = require('request-promise');
var fs = require('fs');

var date = new Date().toISOString();
var logFileName = '../logs/[EXMO]'+date+'errorlog.txt';

function apiRequest() {
    var options = {
      uri: `https://api.exmo.com/v1/ticker/`,
      json: true,
      resolveWithFullResponse: true
    };
  return rq(options).then((res) => {
      return res;
  }).catch((err) => {
    fs.writeFile(logFileName, JSON.stringify(err, null, 3), function(err) {
      if (err) return console.log(err);
      console.log(`[ERROR][EXMO]: log created!`);
    });
  });
};

module.exports = {
  apiRequest
};
