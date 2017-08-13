var rq = require('request-promise');
var fs = require('fs');

var logFileName = `../logs/[KRAKEN]${new Date().toISOString}-errorlog.txt`;

function apiRequest(params, req) {
    var options = {
      uri: `https://api.kraken.com/0/public/${params}`,
      qs: req,
      json: true,
      resolveWithFullResponse: true
    };
  return rq(options).then((res) => {
    return res;
  }).catch((err) => {
    fs.writeFile(logFileName, err, function(err) {
      if (err) return console.log(err);
      console.log(`[ERROR][KRAKEN]: ${logFileName} created!`);
    });
    return err;
  });
};


module.exports = {
  apiRequest
};
