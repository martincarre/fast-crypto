var _ = require('lodash');

var apiRequest = require('./apiRequest.js').apiRequest;

// ====== GET CRAWL LIST:
function getListKR() {
  var tickerArr = [];
  return apiRequest('AssetPairs').then(data => {
    var list = data.body;
    _.map(data.body, function(res) {
      _.map(res, function(content) {
        if (
          content.altname.indexOf('USD') !== -1 &&
          content.altname.indexOf('.d') === -1
        )
          tickerArr.push(content.altname);
      });
    });
    return tickerArr;
  });
}

// ====== GET TICKER DATA:
function kraken(list) {
  return Promise.all(list.map(single))
    .then(res => {
      return res;
    })
    .catch(err => {
      console.log(err);
    });
}
// ===== GET SERVER TIME:

function ksn() {
  return apiRequest('Time').then(data => {
    return data.body.result.unixtime;
  });
}

// ===== GET ORDER DATA:
function order(item) {
  return apiRequest('Depth', { pair: item }).then(res => {
    return {
      bids: res.body.result.XXBTZUSD.bids,
      asks: res.body.result.XXBTZUSD.asks
    };
  });
}

// ===== GET SINGLE TICKER AND ADAPT TO LAYOUT HANDLER:

function single(item) {
  return apiRequest('Ticker', { pair: item })
    .then(res => {
      var result = {};
      var timeStamp = Math.floor(new Date());
      Object.keys(res.body.result).forEach(k => {
        result = {
          mk: 'kraken',
          name: k,
          a: res.body.result[k].a[0],
          b: res.body.result[k].b[0],
          c: res.body.result[k].c[0],
          v: res.body.result[k].v[0],
          p: res.body.result[k].p[0],
          t: res.body.result[k].t[0],
          l: res.body.result[k].l[0],
          h: res.body.result[k].h[0],
          o: res.body.result[k].o[0],
          n: timeStamp,
          aAmt: res.body.result[k].a[2],
          bAmt: res.body.result[k].b[2],
          cAmt: res.body.result[k].c[1],
          v24: res.body.result[k].v[1],
          h24: res.body.result[k].h[1],
          l24: res.body.result[k].l[1],
          p24: res.body.result[k].p[1]
        };
      });
      return result;
    })
    .catch(err => {
      console.log(err);
    });
}

module.exports = {
  kraken,
  getListKR,
  ksn,
  order
};
