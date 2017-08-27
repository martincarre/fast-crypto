var rq = require('request-promise');
var fs = require('fs');

function apiRequest() {
    var options = {
      uri: `https://api.blockchain.info/stats`,
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

apiRequest();

module.exports = {
  apiRequest
};
