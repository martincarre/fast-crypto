var rq = require('request-promise');
var fs = require('fs');

var date = new Date().toISOString();
var logFileName = '../logs/[BITFINEX]'+date+'errorlog.txt';

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
    return res
  }).catch((err) => {
    fs.writeFile(logFileName, JSON.stringify(err, null, 3), function(err) {
      if (err) return console.log(err);
      console.log(`[ERROR][BITFINEX]: log created!`);
    });
  });
};

// function loop() {
//   setTimeout(function () {
//     apiRequest('pubticker', 'btcusd').then((res) => {
//       console.log('OK!');
//     }).catch((err) => {
//       console.log(JSON.stringify(err, null, 3));
//     });
//     loop();
//   }, 1100);
// }
//
// loop();

module.exports = {
  apiRequest
};
