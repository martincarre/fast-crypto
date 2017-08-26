var rq = require('request-promise');
var fs = require('fs');

var date = new Date().toISOString();
var logFileName = '../logs/[KRAKEN]'+date+'errorlog.txt';

function apiRequest(params, req) {
    var options = {
      uri: `https://api.kraken.com/0/public/${params}`,
      qs: req,
      json: true,
      resolveWithFullResponse: true
    };
  return rq(options).then((res) => {
    if (res.statusCode === 200 && !res.body.error.length) {
      return res;
    } else {
      fs.writeFile(logFileName, JSON.stringify(res, null, 3), function(err) {
        if (err) return console.log(err);
        console.log(`[ERROR][KRAKEN]: log created!`);
      });
    }
  }).catch((err) => {
    fs.writeFile(logFileName, JSON.stringify(err, null, 3), function(err) {
      if (err) return console.log(err);
      console.log(`[ERROR][KRAKEN]: log created!`);
    });
  });
};

// function loop() {
//   setTimeout(function () {
//     apiRequest('Ticker', {pair: 'XBTUSD'}).then((res) => {
//     if (res.body.error.length) {
//       console.log(JSON.stringify(res.body.error, null, 3));
//     } else {
//       console.log(JSON.stringify(res.body.result.XXBTZUSD.a[0], null, 3));
//     }
//     }).catch((err) => {
//       console.log(JSON.stringify(err, null, 3));
//     });
//     loop();
//
//   }, 1100);
// }
//
// loop();

module.exports = {
  apiRequest
};
