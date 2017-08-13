var _ = require('lodash');

var apiRequest = require('./apiRequest.js').apiRequest;


// ******************** APP:

  // ====== GET CRAWL LIST:
function getListKR() {
  var tickerArr = [];
  return apiRequest('AssetPairs').then((data) => {
    var list = data.body
    _.map(data.body, function(res) {
      _.map(res , function(content) {
      if (content.altname.indexOf('USD') !== -1 && content.altname.indexOf('.d') === -1) tickerArr.push(content.altname);
      });
    });
    return tickerArr;
  });
};

  // ====== GET TICKER DATA:
function kraken(list) {
  return Promise.all(list.map(single))
  .then((res) => {
    return res;
  });
};

  // ===== GET SINGLE TICKER AND ADAPT TO LAYOUT HANDLER:

function single(item) {
  return apiRequest('Ticker', {pair: item}).then((res) => {
      var result = {};
      var timeStamp = Math.floor(new Date());
      Object.keys(res.body.result).forEach((k) => {
        result= {
              mk: 'kraken',
              name: k,
              a: res.body.result[k].a,
              b: res.body.result[k].b,
              c: res.body.result[k].c,
              v: res.body.result[k].v,
              p: res.body.result[k].p,
              t: res.body.result[k].t,
              l: res.body.result[k].l,
              h: res.body.result[k].h,
              o: res.body.result[k].o,
              n: timeStamp,
        }
      });
      return result;
  })
};

module.exports = {
  kraken,
  getListKR
}
