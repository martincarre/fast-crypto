var rq = require('request-promise');
var fs = require('fs');

var logFileName = `../logs/[BITFINEX]${new Date().toISOString}-errorlog.txt`;

function apiRequest(params, req) {
  var date = new Date().toISOString();
  var logFileName = `../logs/[BITFINEX]${date}-errorlog.txt`;
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
    // if (statusCode === 200) {
    //   return res;
    // } else if (Object.keys(res).length === 0) {
    //   return res;
    // } else {
    //   fs.writeFile(logFileName, JSON.stringify(res, null, 3), function(err) {
    //     if (err) return console.log(err);
    //     console.log(`[ERROR][BITFINEX]: log created!`);
    //   })
    // }
    return res
  }).catch((err) => {
    // if (Object.keys(err).length === 0) {
    //   return err
    // } else {
    //   fs.writeFile(logFileName, JSON.stringify(err, null, 3), function(err) {
    //     if (err) return console.log(err);
    //     var statusCode = JSON.stringify(err.statusCode);
    //     var error = JSON.stringify(err.body);
    //     console.log(`[ERROR][BITFINEX]: log created!`);
    //   });
    // }
      return err;
  });
};

// function loop(i) {
//   setTimeout(function () {
//     apiRequest('pubticker', 'btcusd');
//     console.log('Done! ', i);
//     i++;
//     loop(i);
//   }, 100);
// };
//
// loop(1);

module.exports = {
  apiRequest
};
