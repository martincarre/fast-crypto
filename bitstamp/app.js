// var fs = require('fs');
// var mongo = require('mongodb');
// var mongoose = require('mongoose');
//   mongoose.Promise = global.Promise;
//
var apiRequest = require('./apiRequest.js').apiRequest;
//
// // ******************** MONGOOSE SERVER CONNECTION HANDLER:
//
// var server = mongoose.connect('mongodb://localhost/bitstampAPICollection', {
//   useMongoClient: true,
// });
//
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//   console.log("CONNECTED!");
// });
// // ******************** MONGOOSE SCHEMA AND MODEL CONFIG:
//
// var tickerSchema = mongoose.Schema({
//   name: String,
//   a: Number,
//   b: Number,
//   c: Number,
//   v: Number,
//   p: Number,
//   l: Number,
//   h: Number,
//   o: Number,
//   n: Number,
// });
//
// var Ticker = mongoose.model('Ticker', tickerSchema);

// ******************** APP:

    //      UNCOMMENT & ADAPT IF THE LIST GETS PUBLISHED BY BISTAMP API REST ++ SEE CONFIG FUNC
    //
    //   // ====== GET CRAWL LIST:
    // function getList() {
    //   var tickerArr = [];
    //   return apiRequest('symbols').then((data) => {
    //     var list = data.body
    //     list.map((content) => {
    //       if (content.indexOf('usd') !== -1 ) tickerArr.push(content);
    //     });
    //     return tickerArr;
    //   });
    // };
    //

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
