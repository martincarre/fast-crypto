var apiRequest = require('./apiRequest.js').apiRequest;

// ******************** APP:

// ====== GET CRAWL LIST:
function getListBF() {
  var tickerArr = [];
  return apiRequest('symbols')
    .then(data => {
      var list = data.body;
      list.map(content => {
        if (content.indexOf('usd') !== -1) tickerArr.push(content);
      });
      return tickerArr;
    })
    .catch(err => {
      console.log(err);
    });
}

// ====== GET TICKER DATA:
function bitfinex(list) {
  return Promise.all(list.map(single)).then(res => {
    return res;
  });
}

// ====== GET ORDER DATA:
function order(item) {
  return apiRequest('book', item).then(res => {
    var asks = [];
    var bids = [];
    Object.keys(res.body).forEach(k => {
      if (k === 'asks') {
        Object.keys(res.body[k]).forEach(o => {
          var p = res.body[k][o].price;
          var v = res.body[k][o].amount;
          var sn = res.body[k][o].timestamp;
          var type = k;
          var ask = {
            type: type,
            p: p,
            v: v,
            sn: sn
          };
          asks.push(ask);
        });
      } else if (k === 'bids') {
        Object.keys(res.body[k]).forEach(o => {
          var p = res.body[k][o].price;
          var v = res.body[k][o].amount;
          var sn = res.body[k][o].timestamp;
          var type = k;
          var bid = {
            type: type,
            p: p,
            v: v,
            sn: sn
          };
          bids.push(bid);
        });
      }
    });
    var ob = {
      asks: asks,
      bids: bids
    };
    return ob;
  });
}

// ===== GET SINGLE TICKER AND ADAPT TO LAYOUT HANDLER:

function single(item) {
  return apiRequest('pubticker', item)
    .then(res => {
      var result = {};
      var timeStamp = Math.floor(new Date());
      Object.keys(res.body).forEach(k => {
        result = {
          mk: 'bitfinex',
          name: item,
          a: res.body.ask,
          b: res.body.bid,
          m: res.body.mid,
          c: res.body.last_price,
          v: res.body.volume,
          l: res.body.low,
          h: res.body.high,
          sn: res.body.timestamp,
          n: timeStamp
        };
      });
      return result;
    })
    .catch(err => {
      console.log(err);
    });
}

module.exports = {
  bitfinex,
  getListBF,
  order
};
