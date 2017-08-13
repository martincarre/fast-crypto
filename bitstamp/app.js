var apiRequest = require('./apiRequest.js').apiRequest;


  // ====== GET TICKER DATA:
function bitstamp(list) {
  return Promise.all(list.map(single))
  .then((res) => {
    return res;
  });
};

  // ===== GET SINGLE TICKER AND ADAPT TO LAYOUT HANDLER:

function single(item) {
  return apiRequest('ticker', item).then((res) => {
      var result = {};
      Object.keys(res.body).forEach((k) => {
        result= {
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
              n: res.body.timestamp,
        }
      });
      return result;
  })
};

module.exports = {
  bitstamp
}
