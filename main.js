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
// COINDESK REQUIRE:
var coindesk = require('./coindeskIndex/app.js').coindesk;
var Coindesktick = require('./coindeskIndex/model/coindeskModel').Coindesktick;
// ITBIT REQUIRE:
var itbit = require('./itbit/app.js').itbit;
var Itbittick = require('./itbit/model/itbitModel').Itbittick;

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
// *************************************** COINDESK INDEX


async function loopCDI() {
  setTimeout(
    async function () {
      var data = await coindesk();
        if (data.name === '&#36;') {
          var iname = 'btcusd';
        } else {
          var iname = 'N/A';
        }
        var tick = new Coindesktick({
          mk: data.mk,
          name: data.name,
          c: data.c,
          sn: data.sn,
          n: data.n,
          iname: iname,
        });
        tick.save(function(err, tick) {
          if (err) return console.log(err);
          console.log(`[SUCCESS][CDINDEX]: ${tick.name} added to db!`);
        });
      loopCDI();
  }, 20000); //The price is updated every 60 sec. no need to get it faster. Check: https://www.coindesk.com/api/ for potential changes.
}

loopCDI();

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
            tick.save(function(err, tick) {
              if (err) return console.log(err);
              console.log(`[SUCCESS][BITFINEX]: ${tick.name} added to db!`);
            });
          });
          loopBF();
  }, 1100); // ************  LENGTHARR IS THERE TO AVOID 429
};

loopBF();


// *********************************************************************************************************************
// *********************************************************************************************************************
// *********************************************************************************************************************
// *************************************** ITBIT

async function loopIT() {

  //      UNCOMMENT & ADAPT IF THE LIST GETS PUBLISHED BY BISTAMP API REST
  // var array = await getList();
  // var lengthArr = array.length

  setTimeout(
    async function () {
      var list = ['XBTUSD']; //, 'xrpusd', 'ltcusd']; // ADAPT IF THE LIST GETS PUBLISHED BY BITSTAMP API REST
      var data = await itbit(list);
          data.forEach((object) => {
            if (object.name === 'XBTUSD') {
              var iname = 'btcusd';
            } else {
              var iname = 'N/A';
            }
            var tick = new Itbittick({
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
              aAmt: object.aAmt,
              bAmt: object.bAmt,
              lAmt: object.lAmt,
              v24: object.v24,
              h24: object.h24,
              l24: object.l24,
              p24: object.p24,
            });
            tick.save(function(err, tick) {
              if (err) return console.log(err);
              console.log(`[SUCCESS][ITBIT]: ${tick.name} added to db!`);
            });
          });
          loopIT();
  }, 6000); // ************  GETS UPDATED EVERY 6 SEC ACORDING TO THE SITE
};

loopIT();
