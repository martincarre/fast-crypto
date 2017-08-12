var rq = require('request-promise');

function apiRequest(req) {
  return rq({
    url: `https://api.bitfinex.com/v1/pubticker/${req}`,
    json: true,
    resolveWithFullResponse: true
  }).then((res) => {
    var result = {};
    Object.keys(res.body).forEach((k) => {
      result= {
            name: req,
            a: res.body.ask,
            b: res.body.bid,
            m: res.body.mid,
            c: res.body.last_price,
            v: res.body.volume,
            l: res.body.low,
            h: res.body.high,
            n: res.body.timestamp,
      }
    });
    return result;
  }).catch((err) => {
    return err.statusCode;
  });
};


module.exports = {
  apiRequest
};
