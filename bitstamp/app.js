var apiRequest = require('./apiRequest.js').apiRequest;

// ====== GET TICKER DATA:
function bitstamp(list) {
  return Promise.all(list.map(single))
    .then(res => {
      return res;
    })
    .catch(err => {
      console.log(err);
    });
}

// ====== GET ORDERBOOK DATA:
function order(item) {
  return apiRequest('order_book', item).then(res => {
    var bids = [];
    var asks = [];
    Object.keys(res.body).forEach(k => {
      var first = res.body[k];
      if (k === 'bids') {
        first.forEach(o => {
          var p = o[0];
          var v = o[1];
          var sn = res.body.timestamp;
          var type = k;
          var bid = {
            type: type,
            p: p,
            v: v,
            sn: sn
          };
          bids.push(bid);
        });
      } else if (k === 'asks') {
        first.forEach(o => {
          var p = o[0];
          var v = o[1];
          var sn = res.body.timestamp;
          var type = k;
          var ask = {
            type: type,
            p: p,
            v: v,
            sn: sn
          };
          asks.push(ask);
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
  return apiRequest('ticker', item)
    .then(res => {
      var result = {};
      var timeStamp = Math.floor(new Date());
      Object.keys(res.body).forEach(k => {
        result = {
          mk: 'bitstamp',
          name: item,
          a: res.body.ask,
          b: res.body.bid,
          c: res.body.last,
          v: res.body.volume,
          p: res.body.vwap,
          l: res.body.low,
          h: res.body.high,
          o: res.body.open,
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
  bitstamp,
  order
};
