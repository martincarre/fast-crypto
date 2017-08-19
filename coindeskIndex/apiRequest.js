var rq = require('request-promise');
var fs = require('fs');

function apiRequest() {
    var options = {
      uri: `https://api.coindesk.com/v1/bpi/currentprice.json`,
      json: true,
      resolveWithFullResponse: true
    }
  return rq(options).then((res) => {
    return res;
  }).catch((err) => {
    fs.writeFile(logFileName, err, function(err) {
      if (err) return console.log(err);
    });
    return err;
  });
};

module.exports = {
  apiRequest
};
