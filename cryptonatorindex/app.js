var apiRequest = require('./apiRequest.js').apiRequest;

  // ====== GET TICKER DATA:
function cryptonator(list) {
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
              mk: 'cryptonatorBPI',
              name: res.body.ticker.base+res.body.ticker.target,
              c: res.body.ticker.price,
              v: res.body.ticker.volume,
              sn: res.body.timestamp,
              n: timeStamp,
              base: res.body.ticker.markets,
        }
      return result;
  }).catch((err) => {
    console.log(err);
  });
};

module.exports = {
  cryptonator
}
