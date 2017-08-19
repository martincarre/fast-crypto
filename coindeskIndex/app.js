var apiRequest = require('./apiRequest.js').apiRequest;


  // ===== GET SINGLE TICKER AND ADAPT TO LAYOUT HANDLER:

function coindesk() {
  return apiRequest().then((res) => {
      var result = {};
      var body = res.body;
      var timeStamp = Math.floor(new Date());
      result= {
            mk: 'CoindeskBPI',
            name: body.bpi.USD.symbol,
            c: body.bpi.USD.rate,
            sn: body.time.updatedISO,
            n: timeStamp,
      }
      return result;
  })
};

module.exports = {
  coindesk
}
