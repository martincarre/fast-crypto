const mongo = require('mongodb');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const server = mongoose.connect('mongodb://localhost/cryptoCollection', {
  useMongoClient: true
});

// NOTE: Importing the models for the queries

const { Krakentick } = require('./kraken/model/krakenModel');
const { Bitstamptick } = require('./bitstamp/model/bitstampModel');
const { Bitfinextick } = require('./bitfinex/model/bitfinexModel');
const { Coindesktick } = require('./coindeskIndex/model/coindeskModel');
const { Itbittick } = require('./itbit/model/itbitModel');
const {
  Cryptonatortick
} = require('./cryptonatorindex/model/crytopnatorModel');
const { Bittrextick } = require('./bittrex/model/bittrexModel');

// NOTE: Query the Mongodb to get the latest imports from APIs.

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

function brexquery() {
  return new Promise((resolve, reject) => {
    Bittrextick.findOne({}, {}, { sort: { n: -1 } }, function(err, tick) {
      resolve(tick);
    });
  });
}

function bfiquery() {
  return new Promise((resolve, reject) => {
    Bitfinextick.findOne({}, {}, { sort: { n: -1 } }, function(err, tick) {
      resolve(tick);
    });
  });
}

// NOTE: Function to gather and compare the info from the queries and saving to the db.

setInterval(async function() {
  var pos = 0;
  var ktick = await kquery();
  var bstick = await bsquery();
  var itbtick = await itbquery();
  var brextick = await brexquery();
  var bfitick = await bfiquery();

  var difkbs = {
    // NOTE: MUST EACH OF THE CATEGORIES MUST HAVE AS MANY COMPs AS THERE ARE TICKS
    iname: ktick.iname,
    // NOTE: bfitick *****
    bfiask: {
      comp_abfibk: ktick.b - bfitick.a,
      comp_abfibbs: bstick.b - bfitick.a,
      comp_abfibitb: itbtick.b - bfitick.a,
      comp_abfibbrex: brextick.b * 100 - bfitick.a,
      sreadbfiba: bfitick.b - bfitick.a
    },
    // NOTE: brextick *****
    brexask: {
      comp_abrexbk: ktick.b - brextick.a * 100,
      comp_abrexbbs: bstick.b - brextick.a * 100,
      comp_abrexbitb: itbtick.b - brextick.a * 100,
      compa_abrexbbfi: bfitick.b - brextick.a * 100,
      sreadbrexba: brextick.b * 100 - brextick.a * 100
    },
    // NOTE: ktick *****
    kask: {
      comp_akbbs: bstick.b - ktick.a,
      comp_akbitb: itbtick.b - ktick.a,
      comp_akbbrex: brextick.b * 100 - ktick.a,
      comp_akbbfi: bfitick.b - ktick.a,
      spreadkba: ktick.b - ktick.a
    },
    // NOTE: itbtick ****
    itbask: {
      comp_aitbbbrex: brextick.b * 100 - itbtick.a,
      comp_aitbbk: ktick.b - itbtick.a,
      comp_aitbbbs: bstick.b - itbtick.a,
      comp_aitbbfi: bfitick.b - itbtick.a,
      spreaditb: itbtick.b - itbtick.a
    },
    // NOTE: bstick ****
    bsask: {
      comp_absbitb: itbtick.b - bstick.a,
      comp_absbk: ktick.b - bstick.a,
      comp_absbbrex: brextick.b * 100 - bstick.a,
      comp_absbbfi: bfitick.b - bstick.a,
      spread_bsba: bstick.a - bstick.b
    },
    // NOTE: END OF COMPARING BID ASK

    // NOTE: Request time compare:
    kn: ktick.n,
    bsn: bstick.n,
    itbn: itbtick.n,
    brexn: brextick.n,
    bfin: bfitick.n,

    // NOTE: _id of each tick for reference:
    qid: {
      k_id: ktick._id,
      bs_id: bstick._id,
      itb_id: itbtick._id,
      brex_id: brextick._id,
      bfi_id: bfitick._id
    }
  };

  console.log(JSON.stringify(difkbs, null, 3));
  // if (Math.abs(difkbs.difn) > 1000) {
  //   console.log('More than a second between requests: NA');
  // } else {
  //   console.log(JSON.stringify(difkbs, null, 3));
  //   if (difkbs.compakbbs > 0) {
  //     console.log(
  //       `Buy ${ktick.mk} @${ktick.b / 100} and sell ${bstick.mk} @${bstick.a /
  //         100}. Earned: ${difkbs.compakbbs / 100}`
  //     );
  //   } else if (difkbs.compabsbk > 0) {
  //     console.log(
  //       `Buy ${bstick.mk} @${bstick.b / 100} and sell ${ktick.mk} @${ktick.a /
  //         100}. Earned: ${difkbs.compabsbk / 100}`
  //     );
  //   }
  // }
}, 1100);
