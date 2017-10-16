var rq = require('request-promise');
var fs = require('fs');

var date = new Date().toISOString();
var logFileName = './../logs/[ITBIT]' + date + 'errorlog.txt';

function apiRequest(params, req) {
  var options = {
    uri: `https://api.itbit.com/v1/markets/${params}/${req}`,
    json: true,
    resolveWithFullResponse: true
  };
  return rq(options)
    .then(res => {
      return res;
    })
    .catch(err => {
      fs.writeFile(logFileName, err, function(err) {
        if (err) return console.log(err);
        console.log(`[ERROR][ITBIT]: log created!`);
      });
    });
}

module.exports = {
  apiRequest
};
