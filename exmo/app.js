var _ = require('lodash');

var apiRequest = require('./apiRequest.js').apiRequest;


// ******************** APP:

  // ===== GET SINGLE TICKER AND ADAPT TO LAYOUT HANDLER:

function exmo() {
  Promise.all(
    apiRequest().then((res) => {
        var result = {};
        var timeStamp = Math.floor(new Date());
        Object.keys(res.body).forEach((k) => {
          result= {
            mk: 'exmo',
            name: k,
            a: res.body[k].sell_price,
            b: res.body[k].buy_price,
            c: res.body[k].last_trade,
            v: res.body[k].vol,
            t: res.body[k].vol_curr,
            l: res.body[k].low,
            h: res.body[k].high,
            sn: res.body[k].updated,
            n: timeStamp,
          }
        });
        return result;
    }).catch((err) => {
      console.log(err);
    })
  ).then((res) => {
    console.log(JSON.stringify(res, null, 3));
  })
};

exmo();

module.exports = {
  exmo,
}
