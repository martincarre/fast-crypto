var rq = require('request-promise');
var fs = require('fs');

var logFileName = `../logs/[BITFINEX]${new Date().toISOString}-errorlog.txt`;

function apiRequest(params, req) {
  if (req) {
    var options = {
      uri: `https://api.bitfinex.com/v1/${params}/${req}`,
      json: true,
      resolveWithFullResponse: true
    }
  } else {
    var options = {
      uri: `https://api.bitfinex.com/v1/${params}`,
      json: true,
      resolveWithFullResponse: true
    }
  }
  return rq(options).then((res) => {
    return res;
  }).catch((err) => {
    fs.writeFile(logFileName, err, function(err) {
      if (err) return console.log(err);
      console.log(`[ERROR][BITFINEX]: ${logFileName} created!`);
    });
    return err;
  });
};


module.exports = {
  apiRequest
};
