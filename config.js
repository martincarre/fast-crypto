var fs = require('fs');
var mongo = require('mongodb');
var mongoose = require('mongoose');
  mongoose.Promise = global.Promise;

var apiRequest = require('./app.js').apiRequest;

// ******************** MONGOOSE SERVER CONNECTION HANDLER:

var server = mongoose.connect('mongodb://localhost/bitfinexAPICollection', {
  useMongoClient: true,
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("CONNECTED!");
});
// ******************** MONGOOSE SCHEMA AND MODEL CONFIG:

var tickerSchema = mongoose.Schema({
  name: String,
  a: Number,
  b: Number,
  m: Number,
  c: Number,
  v: Number,
  l: Number,
  h: Number,
  n: Number
});

var Ticker = mongoose.model('Ticker', tickerSchema);

// ******************** APP:

  // ====== GET CRAWL LIST:
function getList() {
  var tickerArr = [];
  return apiRequest('symbols').then((data) => {
    var list = data.body
    list.map((content) => {
      if (content.indexOf('usd') !== -1 ) tickerArr.push(content);
    });
    return tickerArr;
  });
};

  // ====== GET TICKER DATA:
function config(list) {
  return Promise.all(list.map(single))
  .then((res) => {
    return res;
  });
};

  // ===== GET SINGLE TICKER AND ADAPT TO LAYOUT HANDLER:

function single(item) {
  return apiRequest('pubticker', item).then((res) => {
      var result = {};
      Object.keys(res.body).forEach((k) => {
        result= {
              name: item,
              a: res.body.ask,
              b: res.body.bid,
              m: res.body.mid,
              c: res.body.last_price,
              v: res.body.volume,
              l: res.body.low,
              h: res.body.high,
              n: res.body.timestamp,
        }
      });
      return result;
  })
};

async function loop() {
  var array = await getList();
  var lengthArr = array.length
  setTimeout(
    async function () {
      var list = array;
      var data = await config(list);
        if (data.indexOf(429) > -1) {
          console.log('[ERROR]: Too many requests. Waiting until next set of request...');
          setTimeout(function () {
            loop();
          }, 60*1000);
        } else {
          data.forEach((object) => {
            var tick = new Ticker({
              name: object.name,
              a: object.a,
              b: object.b,
              m: object.m,
              c: object.c,
              v: object.v,
              l: object.l,
              h: object.h,
              n: object.n,
            });
            tick.save(function(err, tick) {
              if (err) return console.log(err);
              console.log(`[SUCCESS]: ${tick.name} added to db!`);
            });
          });
          loop();
        }
  }, lengthArr*1000); // ************  LENGTHARR IS THERE TO AVOID 429
};

loop();
