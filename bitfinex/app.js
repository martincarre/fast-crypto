var apiRequest = require('./apiRequest.js').apiRequest;


// ******************** APP:

  // ====== GET CRAWL LIST:
function getListBF() {
  var tickerArr = [];
  return apiRequest('symbols').then((data) => {
    var list = data.body
    list.map((content) => {
      if (content.indexOf('usd') !== -1 ) tickerArr.push(content);
    });
    return tickerArr;
  }).catch((err) => {
    console.log(err);
  });
};

  // ====== GET TICKER DATA:
function bitfinex(list) {
  return Promise.all(list.map(single))
  .then((res) => {
    return res;
  });
};

  // ===== GET SINGLE TICKER AND ADAPT TO LAYOUT HANDLER:

function single(item) {
  return apiRequest('pubticker', item).then((res) => {
      var result = {};
      var timeStamp = Math.floor(new Date());
      Object.keys(res.body).forEach((k) => {
        result= {
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
              n: timeStamp,
        }
      });
      return result;
  }).catch((err) => {
    console.log(err);
  });
};

module.exports = {
  bitfinex,
  getListBF
}
