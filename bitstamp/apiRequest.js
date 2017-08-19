var rq = require('request-promise');
var fs = require('fs');

function apiRequest(params, req) {
  var date = new Date().toISOString();
  var logFileName = '../logs/[BITSTAMP]'+date+'errorlog.txt';
  if (req) {
    var options = {
      uri: `https://www.bitstamp.net/api/v2/${params}/${req}`,
      json: true,
      resolveWithFullResponse: true
    }
  } else {
    var options = {
      uri: `https://www.bitstamp.net/api/v2/${params}`,
      json: true,
      resolveWithFullResponse: true
    }
  }
  return rq(options).then((res) => {
    return res;
  }).catch((err) => {
    fs.writeFile(logFileName, err, function(err) {
      if (err) return console.log(err);
      console.log(`[ERROR][BITSTAMP]: log created!`);
    });
  });
};


module.exports = {
  apiRequest
};
