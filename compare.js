const mongo = require('mongodb');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const server = mongoose.connect('mongodb://localhost/cryptoCollection', {
  useMongoClient: true
});
const { hasMax } = require('./external');
const { hasMin } = require('./external');

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
var maxTimeout = 5;

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

  // NOTE: Order Variables:
  var orderBook = {
    ktickbid: ktick.order.bids.hasMax('p'),
    ktickask: ktick.order.asks.hasMin('p'),
    bstickbid: bstick.order.bids.hasMax('p'),
    bstickask: bstick.order.asks.hasMin('p'),
    itbtickbid: itbtick.order.bids.hasMax('p'),
    itbtickask: itbtick.order.asks.hasMin('p'),
    brextickbid: brextick.order.bids.hasMax('p'),
    brextickask: brextick.order.asks.hasMin('p'),
    bfitickbid: bfitick.order.bids.hasMax('p'),
    bfitickask: bfitick.order.asks.hasMin('p')
  };

  var dif = new compRecord({
    comp: {
      bfiask: {
        comp_abfibk: {
          pdif: orderBook.ktickbid.p - orderBook.bfitickask.p,
          sndif: orderBook.ktickbid.sn - orderBook.bfitickask.sn,
          bidMk: 'ktickbid',
          askMk: 'bfitickask',
          vbid: orderBook.ktickbid.v,
          vask: orderBook.bfitickask.v
        },
        comp_abfibbs: {
          pdif: orderBook.bstickbid.p - orderBook.bfitickask.p,
          sndif: orderBook.bstickbid.sn - orderBook.bfitickask.sn,
          bidMk: 'bstickbid',
          askMk: 'bfitickask',
          vbid: orderBook.bstickbid.v,
          vask: orderBook.bfitickask.v
        },
        comp_abfibitb: {
          pdif: orderBook.itbtickbid.p - orderBook.bfitickask.p,
          sndif: orderBook.itbtickbid.sn - orderBook.bfitickask.sn,
          bidMk: 'itbtickbid',
          askMk: 'bfitickask',
          vbid: orderBook.itbtickbid.v,
          vask: orderBook.bfitickask.v
        },
        comp_abfibbrex: {
          pdif: orderBook.brextickbid.p - orderBook.bfitickask.p,
          sndif: orderBook.brextickbid.sn - orderBook.bfitickask.sn,
          bidMk: 'brextickbid',
          askMk: 'bfitickask',
          vbid: orderBook.brextickbid.v,
          vask: orderBook.bfitickask.v
        },
        sreadbfiba: {
          pdif: orderBook.bfitickbid.p - orderBook.bfitickask.p,
          vbid: orderBook.bfitickbid.v,
          vask: orderBook.bfitickask.v
        }
      },
      brexask: {
        comp_abrexbk: {
          pdif: orderBook.ktickbid.p - orderBook.brextickask.p,
          sndif: orderBook.ktickbid.sn - orderBook.brextickask.sn,
          bidMk: 'ktickbid',
          askMk: 'brextickask',
          vbid: orderBook.ktickbid.v,
          vask: orderBook.brextickask.v
        },
        comp_abrexbbs: {
          pdif: orderBook.bstickbid.p - orderBook.brextickask.p,
          sndif: orderBook.bstickbid.sn - orderBook.brextickask.sn,
          bidMk: 'bstickbid',
          askMk: 'brextickask',
          vbid: orderBook.bstickbid.v,
          vask: orderBook.brextickask.v
        },
        comp_abrexbitb: {
          pdif: orderBook.itbtickbid.p - orderBook.brextickask.p,
          sndif: orderBook.itbtickbid.sn - orderBook.brextickask.sn,
          bidMk: 'itbtickbid',
          askMk: 'brextickask',
          vbid: orderBook.itbtickbid.v,
          vask: orderBook.brextickask.v
        },
        comp_abrexbbfi: {
          pdif: orderBook.bfitickbid.p - orderBook.brextickask.p,
          sndif: orderBook.bfitickbid.sn - orderBook.brextickask.sn,
          bidMk: 'bfitickbid',
          askMk: 'brextickask',
          vbid: orderBook.bfitickbid.v,
          vask: orderBook.brextickask.v
        },
        sreadbrexba: {
          pdif: orderBook.brextickbid.p - orderBook.brextickask.p,
          vbid: orderBook.brextickbid.v,
          vask: orderBook.brextickask.v
        }
      },
      kask: {
        comp_akbbs: {
          pdif: orderBook.bstickbid.p - orderBook.ktickask.p,
          sndif: orderBook.bstickbid.sn - orderBook.ktickask.sn,
          bidMk: 'bstickbid',
          askMk: 'ktickask',
          vbid: orderBook.bstickbid.v,
          vask: orderBook.ktickask.v
        },
        comp_akbitb: {
          pdif: orderBook.itbtickbid.p - orderBook.ktickask.p,
          sndif: orderBook.itbtickbid.sn - orderBook.ktickask.sn,
          bidMk: 'itbtickbid',
          askMk: 'ktickask',
          vbid: orderBook.itbtickbid.v,
          vask: orderBook.ktickask.v
        },
        comp_akbbrex: {
          pdif: orderBook.brextickbid.p - orderBook.ktickask.p,
          sndif: orderBook.brextickbid.sn - orderBook.ktickask.sn,
          bidMk: 'brextickbid',
          askMk: 'ktickask',
          vbid: orderBook.brextickbid.v,
          vask: orderBook.ktickask.v
        },
        comp_akbbfi: {
          pdif: orderBook.bfitickbid.p - orderBook.ktickask.p,
          sndif: orderBook.bfitickbid.sn - orderBook.ktickask.sn,
          bidMk: 'bfitickbid',
          askMk: 'ktickask',
          vbid: orderBook.bfitickbid.v,
          vask: orderBook.ktickask.v
        },
        spreadkba: {
          pdif: orderBook.ktickbid.p - orderBook.ktickask.p,
          vbid: orderBook.ktickbid.v,
          vask: orderBook.ktickask.v
        }
      },
      itbask: {
        comp_aitbbbrex: {
          pdif: orderBook.brextickbid.p - orderBook.itbtickask.p,
          sndif: orderBook.brextickbid.sn - orderBook.itbtickask.sn,
          bidMk: 'brextickbid',
          askMk: 'itbtickask',
          vbid: orderBook.brextickbid.v,
          vask: orderBook.itbtickask.v
        },
        comp_aitbbk: {
          pdif: orderBook.ktickbid.p - orderBook.itbtickask.p,
          sndif: orderBook.ktickbid.sn - orderBook.itbtickask.sn,
          bidMk: 'ktickbid',
          askMk: 'itbtickask',
          vbid: orderBook.ktickbid.v,
          vask: orderBook.itbtickask.v
        },
        comp_aitbbbs: {
          pdif: orderBook.bstickbid.p - orderBook.itbtickask.p,
          sndif: orderBook.bstickbid.sn - orderBook.itbtickask.sn,
          bidMk: 'bstickbid',
          askMk: 'itbtickask',
          vbid: orderBook.bstickbid.v,
          vask: orderBook.itbtickask.v
        },
        comp_aitbbfi: {
          pdif: orderBook.bfitickbid.p - orderBook.itbtickask.p,
          sndif: orderBook.bfitickbid.sn - orderBook.itbtickask.sn,
          bidMk: 'bfitickbid',
          askMk: 'itbtickask',
          vbid: orderBook.bfitickbid.v,
          vask: orderBook.itbtickask.v
        },
        spreaditb: {
          pdif: orderBook.itbtickbid.p - orderBook.itbtickask.p,
          vbid: orderBook.itbtickbid.v,
          vask: orderBook.itbtickask.v
        }
      },
      bsask: {
        comp_absbitb: {
          pdif: orderBook.itbtickbid.p - orderBook.bstickask.p,
          sndif: orderBook.itbtickbid.sn - orderBook.bstickask.sn,
          bidMk: 'itbtickbid',
          askMk: 'bstickask',
          vbid: orderBook.itbtickbid.v,
          vask: orderBook.bstickask.v
        },
        comp_absbk: {
          pdif: orderBook.ktickbid.p - orderBook.bstickask.p,
          sndif: orderBook.ktickbid.sn - orderBook.bstickask.sn,
          bidMk: 'ktickbid',
          askMk: 'bstickask',
          vbid: orderBook.ktickbid.v,
          vask: orderBook.bstickask.v
        },
        comp_absbbrex: {
          pdif: orderBook.brextickbid.p - orderBook.bstickask.p,
          sndif: orderBook.brextickbid.sn - orderBook.bstickask.sn,
          bidMk: 'brextickbid',
          askMk: 'bstickask',
          vbid: orderBook.brextickbid.v,
          vask: orderBook.bstickask.v
        },
        comp_absbbfi: {
          pdif: orderBook.bfitickbid.p - orderBook.bstickask.p,
          sndif: orderBook.bfitickbid.sn - orderBook.bstickask.sn,
          bidMk: 'bfitickbid',
          askMk: 'bstickask',
          vbid: orderBook.bfitickbid.v,
          vask: orderBook.bstickask.v
        },
        spread_bsba: {
          pdif: orderBook.bstickbid.p - orderBook.bstickask.p,
          vbid: orderBook.bstickbid.v,
          vask: orderBook.bstickask.v
        }
      }
    }
  });

  Object.keys(dif.comp).forEach(k => {
    Object.keys(dif.comp[k]).forEach(p => {
      if (
        dif.comp[k][p].pdif >= minimumGain &&
        dif.comp[k][p].sndif <= maxTimeout
      ) {
        var volAsk = dif.comp[k][p].vask;
        var volBid = dif.comp[k][p].vbid;
        var pDif = dif.comp[k][p].pdif;
        console.log(
          `${volBid} available to buy and ${volAsk} available to sell for $${pDif}`
        );
      }
    });
  });

  // dif.save(function(err, dif) {
  //   if (err) return console.log(err);
  //   console.log('Comparision instance saved!');
  // });

  // Object.keys(dif.comp).forEach(k => {
  //   Object.keys(dif.comp[k]).forEach(p => {
  //     if (dif.comp[k][p].g / 100 > minimumGain) {
  //       var buyMk = dif.comp[k][p].a;
  //       var sellMk = dif.comp[k][p].b;
  //       var orderBuy = dif.ob[buyMk];
  //       var orderSell = dif.ob[sellMk];
  //       console.log(
  //         `Buy with ${buyMk} and Sell with ${sellMk} for $${dif.comp[k][p].g /
  //           100}`
  //       );
  //       var shoot = orderBuy.bids.hasMax('p');
  //       // var shootsn = shoot.sn;
  //       var plux = orderSell.asks.hasMin('p');
  //       // var pluxsn = plux.sn;
  //       console.log(`Buy: ${shoot.p} / Sell ${plux.p}`);
  //       var delta = plux.p - shoot.p;
  //       console.log('Real difference between mks: $', delta);
  //       // console.log(
  //       //   `Timestamp difference: ${shootsn -
  //       //     pluxsn} (buy - sell) -- Buy:${shootsn} // Sell:${pluxsn}`
  //       // );
  //       // console.log(dif.qid);
  //     }
  //   });
  // });
}, 1100);
