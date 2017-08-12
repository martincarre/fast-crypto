var fs = require('fs');
var mongo = require('mongodb');
var mongoose = require('mongoose');
  mongoose.Promise = global.Promise;

var bitstamp = require('./bitstamp/app.js').bitstamp;

// ******************** MONGOOSE SERVER CONNECTION HANDLER:

var server = mongoose.connect('mongodb://localhost/bitstampAPICollection', {
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
  c: Number,
  v: Number,
  p: Number,
  l: Number,
  h: Number,
  o: Number,
  n: Number,
});

var Ticker = mongoose.model('Ticker', tickerSchema);


async function loop() {

  //      UNCOMMENT & ADAPT IF THE LIST GETS PUBLISHED BY BISTAMP API REST
  // var array = await getList();
  // var lengthArr = array.length
  setTimeout(
    async function () {
      var list = ['btcusd', 'xrpusd', 'ltcusd']; // ADAPT IF THE LIST GETS PUBLISHED BY BITSTAMP API REST
      var data = await bitstamp(list);
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
              l: object.l,
              h: object.h,
              o: object.o,
              n: object.n,
            });
            console.log(`Ask for ${tick.name}: ${tick.a}`);
            tick.save(function(err, tick) {
              if (err) return console.log(err);
              console.log(`[SUCCESS]: ${tick.name} added to db!`);
            });
          });
          loop();
        }
  }, 3*1000); // ************  LENGTHARR IS THERE TO AVOID 429
};

loop();
