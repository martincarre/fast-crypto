const fs = require('fs');
const mongo = require('mongodb');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// BITSTAMP REQUIRE:
const bsorder = require('./bitstamp/app.js').bsorder;
const { bitstamp } = require('./bitstamp/app.js');
const { Bitstamptick } = require('./bitstamp/model/bitstampModel');
// KRAKEN REQUIRE:
const { ksn } = require('./kraken/app.js');
const { kraken } = require('./kraken/app.js');
const { getListKR } = require('./kraken/app.js');
const { Krakentick } = require('./kraken/model/krakenModel');
// BITFINEX REQUIRE:
const { bitfinex } = require('./bitfinex/app.js');
const { getListBF } = require('./bitfinex/app.js');
const { Bitfinextick } = require('./bitfinex/model/bitfinexModel');
// COINDESK REQUIRE:
const { coindesk } = require('./coindeskIndex/app.js');
const { Coindesktick } = require('./coindeskIndex/model/coindeskModel');
// ITBIT REQUIRE:
const itorder = require('./itbit/app.js').order;
const { itbit } = require('./itbit/app.js');
const { Itbittick } = require('./itbit/model/itbitModel');
// CRYPTONATOR REQUIRE:
const { cryptonator } = require('./cryptonatorindex/app.js');
const {
  Cryptonatortick
} = require('./cryptonatorindex/model/crytopnatorModel');
// BLOCKCHAININFO REQUIRE:
const { blockchaininfo } = require('./blockchaininfo/app.js');
const {
  Blockchaininfotick
} = require('./blockchaininfo/model/blockchaininfoModel');
// BITTREX REQUIRE:
const brexorder = require('./bittrex/app.js').order;
const { bittrex } = require('./bittrex/app.js');
const { Bittrextick } = require('./bittrex/model/bittrexModel');

// *********************************************************************************************************************
// *********************************************************************************************************************
// *********************************************************************************************************************
// *************************************** MONGOOSE SERVER CONNECTION HANDLER:

var server = mongoose.connect('mongodb://localhost/cryptoCollection', {
  useMongoClient: true
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('CONNECTED!');
});

// *********************************************************************************************************************
// *********************************************************************************************************************
// *********************************************************************************************************************
// *************************************** BLOCKCHAININFO

setInterval(async function() {
  var data = await blockchaininfo();
  var iname = 'btcusd';
  var tick = new Blockchaininfotick({
    mk: data.mk,
    c: data.c,
    hash_rate: data.hash_rate,
    total_fees_btc: data.total_fees_btc,
    n_btc_mined: data.n_btc_mined,
    n_tx: data.n_tx,
    n_blocks_mined: data.n_blocks_mined,
    minutes_between_blocks: data.minutes_between_blocks,
    totalbc: data.totalbc,
    n_blocks_total: data.n_blocks_total,
    estimated_transaction_volume_usd: data.estimated_transaction_volume_usd,
    blocks_size: data.blocks_size,
    miners_revenue_usd: data.miners_revenue_usd,
    nextretarget: data.nextretarget,
    difficulty: data.difficulty,
    estimated_btc_sent: data.estimated_btc_sent,
    miners_revenue_btc: data.miners_revenue_btc,
    total_btc_sent: data.total_btc_sent,
    trade_volume_btc: data.trade_volume_btc,
    trade_volume_usd: data.trade_volume_usd,
    sn: data.sn,
    n: data.n,
    iname: iname
  });
  tick.save(function(err, tick) {
    if (err) return console.log(err);
    console.log(`[SUCCESS][BLOCKHAININFO]: ${tick.iname} added to db!`);
  });
}, 20000);

// *********************************************************************************************************************
// *********************************************************************************************************************
// *********************************************************************************************************************
// *************************************** CRYPTONATOR INDEX

setInterval(async function() {
  var list = ['btc-usd'];
  var data = await cryptonator(list);
  data.forEach(object => {
    if (object.name === 'BTCUSD') {
      var iname = 'btcusd';
    } else {
      var iname = 'N/A';
    }
    var tick = new Cryptonatortick({
      mk: object.mk,
      name: object.name,
      c: object.c,
      v: object.v,
      sn: object.sn,
      n: object.n,
      iname: iname,
      base: object.markets
    });
    tick.save(function(err, tick) {
      if (err) return console.log(err);
      console.log(`[SUCCESS][CRYPTOBPI]: ${tick.name} added to db!`);
    });
  });
}, 20000);

// *********************************************************************************************************************
// *********************************************************************************************************************
// *********************************************************************************************************************
// *************************************** COINDESK INDEX

setInterval(async function() {
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
    iname: iname
  });
  tick.save(function(err, tick) {
    if (err) return console.log(err);
    console.log(`[SUCCESS][CDINDEX]: ${tick.name} added to db!`);
  });
}, 20000);

// *********************************************************************************************************************
// *********************************************************************************************************************
// *********************************************************************************************************************
// *************************************** BITSTAMP

setInterval(async function() {
  var list = ['btcusd']; //, 'xrpusd', 'ltcusd']; // ADAPT IF THE LIST GETS PUBLISHED BY BITSTAMP API REST
  var data = await bitstamp(list);
  var order = await bsorder(list);
  data.forEach(object => {
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
      order: order
    });
    tick.save(function(err, tick) {
      if (err) return console.log(err);
      console.log(`[SUCCESS][BITSTAMP]: ${tick.name} added to db!`);
    });
  });
}, 1100);

// *********************************************************************************************************************
// *********************************************************************************************************************
// *********************************************************************************************************************
// *************************************** KRAKEN

setInterval(async function() {
  var list = ['XBTUSD']; //await getListKR();
  var data = await kraken(list);
  var sn = await ksn();
  data.forEach(object => {
    if (object.name === 'XXBTZUSD') {
      var iname = 'btcusd';
    } else {
      var iname = 'N/A';
    }
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
      sn: sn,
      iname: iname,
      aAmt: object.aAmt,
      bAmt: object.bAmt,
      cAmt: object.cAmt,
      v24: object.v24,
      h24: object.h24,
      l24: object.l24,
      p24: object.p24
    });
    // console.log(JSON.stringify(tick, null, 3));
    // tick.sendToCompare();
    tick.save(function(err, tick) {
      if (err) return console.log(err);
      console.log(`[SUCCESS][KRAKEN]: ${tick.name} added to db!`);
    });
  });
}, 1100);

// *********************************************************************************************************************
// *********************************************************************************************************************
// *********************************************************************************************************************
// *************************************** BITFINEX

setInterval(async function() {
  var list = ['btcusd']; //await getList();
  var data = await bitfinex(list);
  data.forEach(object => {
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
      iname: iname
    });
    tick.save(function(err, tick) {
      if (err) return console.log(err);
      console.log(`[SUCCESS][BITFINEX]: ${tick.name} added to db!`);
    });
  });
}, 1100);

// *********************************************************************************************************************
// *********************************************************************************************************************
// *********************************************************************************************************************
// *************************************** ITBIT

setInterval(async function() {
  var list = ['XBTUSD'];
  var data = await itbit(list);
  var order = await itorder('XBTUSD');
  data.forEach(object => {
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
      cAmt: object.cAmt,
      v24: object.v24,
      h24: object.h24,
      l24: object.l24,
      p24: object.p24,
      order: order
    });
    tick.save(function(err, tick) {
      if (err) return console.log(err);
      console.log(`[SUCCESS][ITBIT]: ${tick.name} added to db!`);
    });
  });
}, 6000);

// *********************************************************************************************************************
// *********************************************************************************************************************
// *********************************************************************************************************************
// *************************************** BITTREX

setInterval(async function() {
  var list = ['USDT-BTC'];
  var data = await bittrex(list);
  var order = await brexorder('USDT-BTC');
  data.forEach(object => {
    if (object.name === 'USDT-BTC') {
      var iname = 'btcusd';
    } else {
      var iname = 'N/A';
    }
    var tick = new Bittrextick({
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
      OpenBuyOrders: object.OpenBuyOrders,
      OpenSellOrders: object.OpenSellOrders,
      order: order
    });
    tick.save(function(err, tick) {
      if (err) return console.log(err);
      console.log(`[SUCCESS][BITTREX]: ${tick.name} added to db!`);
    });
  });
}, 1100);
