var fs = require('fs');
var mongo = require('mongodb');
var mongoose = require('mongoose');
  mongoose.Promise = global.Promise;
var _ = require('lodash');

var apiRequest = require('./app.js').apiRequest;

// ******************** MONGOOSE SERVER CONNECTION HANDLER:

var server = mongoose.connect('mongodb://localhost/krakenAPICollection', {
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
  a: Array,
  b: Array,
  c: Array,
  v: Array,
  p: Array,
  t: Array,
  l: Array,
  h: Array,
  o: Number,
  n: Number
});

var Ticker = mongoose.model('Ticker', tickerSchema);

// ******************** APP:

  // ====== GET CRAWL LIST:
function getList() {
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
function config(list) {
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
              c: object.c,
              v: object.v,
              p: object.p,
              t: object.t,
              l: object.l,
              h: object.h,
              o: object.o,
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
