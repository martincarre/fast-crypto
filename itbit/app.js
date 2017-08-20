var apiRequest = require('./apiRequest.js').apiRequest;


  // ====== GET TICKER DATA:
function itbit(list) {
  return Promise.all(list.map(single))
  .then((res) => {
    return res;
  }).catch((err) => {
    console.log(err);
  });
};

  // ===== GET SINGLE TICKER AND ADAPT TO LAYOUT HANDLER:

function single(item) {
  return apiRequest(item).then((res) => {
      var result = {};
      var timeStamp = Math.floor(new Date());
        result= {
              mk: 'itbit',
              name: res.body.pair,
              a: res.body.ask,
              b: res.body.bid,
              c: res.body.lastPrice,
              v: res.body.volumeToday,
              p: res.body.vwapToday,
              l: res.body.lowToday,
              h: res.body.highToday,
              o: res.body.openToday,
              sn: res.body.serverTimeUTC,
              n: timeStamp,
              aAmt: res.body.askAmt,
              bAmt: res.body.bidAmt,
              lAmt: res.body.lastAmt,
              v24: res.body.volume24h,
              h24: res.body.high24h,
              l24: res.body.low24h,
              p24: res.body.vwap24h,
        }
      return result;
  }).catch((err) => {
    console.log(err);
  });
};

itbit(['XBTUSD']);

module.exports = {
  itbit
}
