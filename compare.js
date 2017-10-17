const mongo = require('mongodb');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const server = mongoose.connect('mongodb://localhost/cryptoCollection', {
  useMongoClient: true
});

// NOTE: Model for saving the comps:
const { compRecord } = require('./models/compModel');

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
var minimumGain = 3;
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
  var ktick = await kquery();
  var bstick = await bsquery();
  var itbtick = await itbquery();
  var brextick = await brexquery();
  var bfitick = await bfiquery();

  var dif = new compRecord({
    // NOTE: MUST EACH OF THE CATEGORIES MUST HAVE AS MANY COMPs AS THERE ARE TICKS
    iname: ktick.iname,
    // NOTE: bfitick *****
    comp: {
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
      }
    },
    // NOTE: END OF COMPARING BID ASK

    // NOTE: Request local-time compare:
    n: {
      kn: ktick.n,
      bsn: bstick.n,
      itbn: itbtick.n,
      brexn: brextick.n,
      bfin: bfitick.n
    },

    // NOTE: Request local-time compare:
    sn: {
      ksn: ktick.sn,
      bssn: bstick.sn,
      itbsn: itbtick.sn,
      brexsn: brextick.sn,
      bfisn: bfitick.sn
    },

    // NOTE: _id of each tick for reference:
    qid: {
      k_id: ktick._id,
      bs_id: bstick._id,
      itb_id: itbtick._id,
      brex_id: brextick._id,
      bfi_id: bfitick._id
    },

    // NOTE: Order book for each ticker:
    ob: {
      k_ob: ktick.order,
      bs_ob: bstick.order,
      itb_ob: itbtick.order,
      brex_ob: brextick.order,
      bfi_ob: bfitick.order
    }
  });

  dif.save(function(err, dif) {
    if (err) return console.log(err);
    console.log('Comparision instance saved!');
  });

  Object.keys(dif.comp).forEach(k => {
    Object.keys(dif.comp[k]).forEach(p => {
      if (dif.comp[k][p] / 100 > minimumGain) {
        console.log(`${p} for $${dif.comp[k][p] / 100}`);
      }
    });
  });
}, 1100);
