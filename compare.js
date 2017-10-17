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

// NOTE: Other VAR Declarations:
var minimumGain = 5;
var totalGain = [];

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
        comp_abfibk: { b: 'kraken', a: 'bitfinex', g: ktick.b - bfitick.a },
        comp_abfibbs: { b: 'bitstamp', a: 'bitfinex', g: bstick.b - bfitick.a },
        comp_abfibitb: { b: 'itbit', a: 'bitfinex', g: itbtick.b - bfitick.a },
        comp_abfibbrex: {
          b: 'bittrex',
          a: 'bitfinex',
          g: brextick.b * 100 - bfitick.a
        },
        sreadbfiba: bfitick.b - bfitick.a
      },
      // NOTE: brextick *****
      brexask: {
        comp_abrexbk: {
          b: 'kraken',
          a: 'bittrex',
          g: ktick.b - brextick.a * 100
        },
        comp_abrexbbs: {
          b: 'bitstamp',
          a: 'bittrex',
          g: bstick.b - brextick.a * 100
        },
        comp_abrexbitb: {
          b: 'itbit',
          a: 'bittrex',
          g: itbtick.b - brextick.a * 100
        },
        compa_abrexbbfi: {
          b: 'bitfinex',
          a: 'bittrex',
          g: bfitick.b - brextick.a * 100
        },
        sreadbrexba: brextick.b * 100 - brextick.a * 100
      },
      // NOTE: ktick *****
      kask: {
        comp_akbbs: { b: 'bitstamp', a: 'kraken', g: bstick.b - ktick.a },
        comp_akbitb: { b: 'itbit', a: 'kraken', g: itbtick.b - ktick.a },
        comp_akbbrex: {
          b: 'bittrex',
          a: 'kraken',
          g: brextick.b * 100 - ktick.a
        },
        comp_akbbfi: { b: 'bitfinex', a: 'kraken', g: bfitick.b - ktick.a },
        spreadkba: ktick.b - ktick.a
      },
      // NOTE: itbtick ****
      itbask: {
        comp_aitbbbrex: {
          b: 'bittrex',
          a: 'itbit',
          g: brextick.b * 100 - itbtick.a
        },
        comp_aitbbk: { b: 'kraken', a: 'itbit', g: ktick.b - itbtick.a },
        comp_aitbbbs: { b: 'bitstamp', a: 'itbit', g: bstick.b - itbtick.a },
        comp_aitbbfi: { b: 'bitfinex', a: 'itbit', g: bfitick.b - itbtick.a },
        spreaditb: itbtick.b - itbtick.a
      },
      // NOTE: bstick ****
      bsask: {
        comp_absbitb: { b: 'itbit', a: 'bitstamp', g: itbtick.b - bstick.a },
        comp_absbk: { b: 'kraken', a: 'bitstamp', g: ktick.b - bstick.a },
        comp_absbbrex: {
          b: 'bittrex',
          a: 'bitstamp',
          g: brextick.b * 100 - bstick.a
        },
        comp_absbbfi: { b: 'bitfinex', a: 'bitstamp', g: bfitick.b - bstick.a },
        spread_bsba: bstick.b - bstick.a
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
      if (dif.comp[k][p].g / 100 > minimumGain) {
        console.log(
          `Buy with ${dif.comp[k][p].a} and Sell with ${dif.comp[k][p]
            .b} for $${dif.comp[k][p].g / 100}`
        );
      }
    });
  });
}, 1100);
