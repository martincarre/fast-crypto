var fs = require('fs');
var mongo = require('mongodb');
var mongoose = require('mongoose');
  mongoose.Promise = global.Promise;

// BITSTAMP REQUIRE:
var bitstamp = require('./bitstamp/app.js').bitstamp;
var Bitstamptick = require('./bitstamp/model/bitstampModel').Bitstamptick;
// KRAKEN REQUIRE:
var kraken = require('./kraken/app.js').kraken;
var getListKR = require('./kraken/app.js').getListKR;
var Krakentick = require('./kraken/model/krakenModel').Krakentick;
// BITFINEX REQUIRE:
var bitfinex = require('./bitfinex/app.js').bitfinex;
var getListBF = require('./bitfinex/app.js').getListBF;
var Bitfinextick = require('./bitfinex/model/bitfinexModel').Bitfinextick;

// *********************************************************************************************************************
// *********************************************************************************************************************
// *********************************************************************************************************************
// *************************************** MONGOOSE SERVER CONNECTION HANDLER:

var server = mongoose.connect('mongodb://localhost/cryptoCollection', {
  useMongoClient: true,
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("CONNECTED!");
});

// *********************************************************************************************************************
// *********************************************************************************************************************
// *********************************************************************************************************************
// *************************************** BITSTAMP

async function loopBS() {

  //      UNCOMMENT & ADAPT IF THE LIST GETS PUBLISHED BY BISTAMP API REST
  // var array = await getList();
  // var lengthArr = array.length

  setTimeout(
    async function () {
      var list = ['btcusd']; //, 'xrpusd', 'ltcusd']; // ADAPT IF THE LIST GETS PUBLISHED BY BITSTAMP API REST
      var data = await bitstamp(list);
        if (data.indexOf(429) > -1) {
          console.log('[ERROR]: Too many requests. Waiting until next set of request...');
          setTimeout(function () {
            loopBS();
          }, 60*1000);
        } else {
          data.forEach((object) => {
            if (object.name === 'btcusd') {
              var iname = 'btcusd';
            } else {
              var iname = 'N/A';
            }
            var tick = new Bitstamptick({
              mk: object.mk,
              name: object.name,
              a: object.a,
              b: object.b,
              c: object.c,
              v: object.v,
              p: object.p,
              l: object.l,
              h: object.h,
              o: object.o,
              sn: object.sn,
              n: object.n,
              iname: iname,
            });
            // console.log(JSON.stringify(tick, null, 3));
            // tick.sendToCompare();
            tick.save(function(err, tick) {
              if (err) return console.log(err);
              console.log(`[SUCCESS][BITSTAMP]: ${tick.name} added to db!`);
            });
          });
          loopBS();
        }
  }, 1100); // ************  LENGTHARR IS THERE TO AVOID 429
};

loopBS();


// *********************************************************************************************************************
// *********************************************************************************************************************
// *********************************************************************************************************************
// *************************************** KRAKEN

async function loopKR() {
  setTimeout(
    async function () {
      var list = ['XBTUSD']; //await getListKR();
      var data = await kraken(list);
        if (data.indexOf(429) > -1) {
          console.log('[ERROR]: Too many requests. Waiting until next set of request...');
          setTimeout(function () {
            loopKR();
          }, 60*1000);
        } else {
          data.forEach((object) => {
            if (object.name === 'XXBTZUSD') {
              var iname =  'btcusd'
            } else {
              var iname = 'N/A' };
            var tick = new Krakentick({
              mk: object.mk,
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
              iname: iname,
            });
            // console.log(JSON.stringify(tick, null, 3));
            // tick.sendToCompare();
            tick.save(function(err, tick) {
              if (err) return console.log(err);
              console.log(`[SUCCESS][KRAKEN]: ${tick.name} added to db!`);
            });
          });
          loopKR();
        }
  }, 1100); // CHANGE HERE TO ADJUST REQUEST TIMEOUT
};

loopKR();

// *********************************************************************************************************************
// *********************************************************************************************************************
// *********************************************************************************************************************
// *************************************** BITFINEX

async function loopBF() {
  setTimeout(
    async function () {
      var list = ['btcusd']; //await getList();
      var data = await bitfinex(list);
        if (data.indexOf(429) > -1) {
          console.log('[ERROR]: Too many requests. Waiting until next set of request...');
          setTimeout(function () {
            loopBF();
          }, 60*1000);
        } else {
          data.forEach((object) => {
            if (object.name === 'btcusd') {
              var iname = 'btcusd';
            } else {
              var iname = 'N/A';
            }
            var tick = new Bitfinextick({
              mk: object.mk,
              name: object.name,
              a: object.a,
              b: object.b,
              m: object.m,
              c: object.c,
              v: object.v,
              l: object.l,
              h: object.h,
              sn: object.sn,
              n: object.n,
              iname: iname,
            });
            // console.log(JSON.stringify(tick, null, 3));
            // tick.sendToCompare();
            tick.save(function(err, tick) {
              if (err) return console.log(err);
              console.log(`[SUCCESS][BITFINEX]: ${tick.name} added to db!`);
            });
          });
          loopBF();
        }
  }, 1100); // ************  LENGTHARR IS THERE TO AVOID 429
};

loopBF();
