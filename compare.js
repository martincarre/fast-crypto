const mongo = require('mongodb');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const server = mongoose.connect('mongodb://localhost/cryptoCollection', {
  useMongoClient: true
});

const { Krakentick } = require('./kraken/model/krakenModel');
const { Bitstamptick } = require('./bitstamp/model/bitstampModel');
const { Bitfinextick } = require('./bitfinex/model/bitfinexModel');
const { Coindesktick } = require('./coindeskIndex/model/coindeskModel');
const { Itbittick } = require('./itbit/model/itbitModel');
const {
  Cryptonatortick
} = require('./cryptonatorindex/model/crytopnatorModel');
const { Bittrextick } = require('./bittrex/model/bittrexModel');

function bsquery() {
  return new Promise((resolve, reject) => {
    Bitstamptick.findOne({}, {}, { sort: { n: -1 } }, function(err, tick) {
      resolve(tick);
    });
  });
}

function kquery() {
  return new Promise((resolve, reject) => {
    Krakentick.findOne({}, {}, { sort: { n: -1 } }, function(err, tick) {
      resolve(tick);
    });
  });
}

function itbquery() {
  return new Promise((resolve, reject) => {
    Itbittick.findOne({}, {}, { sort: { n: -1 } }, function(err, tick) {
      resolve(tick);
    });
  });
}

setInterval(async function() {
  var pos = 0;
  var ktick = await kquery();
  var bstick = await bsquery();
  var itbtick = await itbquery();
  var difkbs = {
    iname: ktick.iname,
    comp_akbitb: itbtick.b - ktick.a,
    comp_absbitb: itbtick.b - bstick.a,
    comp_aitbbk: ktick.b - itbtick.a,
    comp_aitbbbs: bstick.b - itbtick.a,
    comp_akbbs: bstick.b - ktick.a,
    comp_absbk: ktick.b - bstick.a,
    difc_kbs: ktick.c - bstick.c,
    difn_kbs: ktick.n - bstick.n,
    difa_kbs: ktick.a - bstick.a,
    difb_kbs: ktick.b - bstick.b,
    spread_kba: ktick.a - ktick.b,
    spread_bsba: bstick.a - bstick.b,
    baspread_kbs: ktick.a - bstick.a - (ktick.b - bstick.b),
    kn: ktick.n,
    bsn: bstick.n,
    itbn: itbtick.n,
    k_id: ktick._id,
    bs_id: bstick._id,
    itb_id: itbtick._id
  };

  if (Math.abs(difkbs.difn) > 1000) {
    console.log('More than a second between requests: NA');
  } else {
    console.log(JSON.stringify(difkbs, null, 3));
    if (difkbs.compakbbs > 0) {
      console.log(
        `Buy ${ktick.mk} @${ktick.b / 100} and sell ${bstick.mk} @${bstick.a /
          100}. Earned: ${difkbs.compakbbs / 100}`
      );
    } else if (difkbs.compabsbk > 0) {
      console.log(
        `Buy ${bstick.mk} @${bstick.b / 100} and sell ${ktick.mk} @${ktick.a /
          100}. Earned: ${difkbs.compabsbk / 100}`
      );
    }
  }
}, 1100);
