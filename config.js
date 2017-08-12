var fs = require('fs');
var apiRequest = require('./app.js').apiRequest;

function config(list) {
  return Promise.all(list.map(apiRequest))
  .then((res) => {
    return res;
    // console.log(JSON.stringify(res, undefined, 3));
  })
};

function loop() {
  setTimeout(
    async function () {
      var list = ['btcusd', 'ltcusd', 'zecusd', 'etcusd'];
      var data = await config(list);
        if (data.indexOf(429) > -1) {
          console.log('[ERROR]: Too many requests. Waiting until next set of request...');
          setTimeout(function () {
            loop();
          }, 60*1000);
        } else {
          console.log(JSON.stringify(data, undefined, 3));
          loop();
        }
  }, 4000);
};

loop();
