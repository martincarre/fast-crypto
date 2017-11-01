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
const { orderToPass } = require('./models/orderModel');

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
var maxTimeout = 5;
var orderTP = [];

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

  // NOTE: Creating the comparision between markets
  var dif = new compRecord({
    comp: {
      bfiask: {
        comp_abfibk: {
          pbid: orderBook.ktickbid.p,
          pask: orderBook.bfitickask.p,
          pdif: orderBook.ktickbid.p - orderBook.bfitickask.p,
          sndif: orderBook.ktickbid.sn - orderBook.bfitickask.sn,
          bidMk: 'ktickbid',
          askMk: 'bfitickask',
          vbid: orderBook.ktickbid.v,
          vask: orderBook.bfitickask.v,
          snbid: orderBook.ktickbid.sn,
          snask: orderBook.bfitickask.sn
        },
        comp_abfibbs: {
          pbid: orderBook.bstickbid.p,
          pask: orderBook.bfitickask.p,
          pdif: orderBook.bstickbid.p - orderBook.bfitickask.p,
          sndif: orderBook.bstickbid.sn - orderBook.bfitickask.sn,
          bidMk: 'bstickbid',
          askMk: 'bfitickask',
          vbid: orderBook.bstickbid.v,
          vask: orderBook.bfitickask.v,
          snbid: orderBook.bstickbid.sn,
          snask: orderBook.bfitickask.sn
        },
        comp_abfibitb: {
          pbid: orderBook.itbtickbid.p,
          pask: orderBook.bfitickask.p,
          pdif: orderBook.itbtickbid.p - orderBook.bfitickask.p,
          sndif: orderBook.itbtickbid.sn - orderBook.bfitickask.sn,
          bidMk: 'itbtickbid',
          askMk: 'bfitickask',
          vbid: orderBook.itbtickbid.v,
          vask: orderBook.bfitickask.v,
          snbid: orderBook.itbtickbid.sn,
          snask: orderBook.bfitickask.sn
        },
        comp_abfibbrex: {
          pbid: orderBook.brextickbid.p,
          pask: orderBook.bfitickask.p,
          pdif: orderBook.brextickbid.p - orderBook.bfitickask.p,
          sndif: orderBook.brextickbid.sn - orderBook.bfitickask.sn,
          bidMk: 'brextickbid',
          askMk: 'bfitickask',
          vbid: orderBook.brextickbid.v,
          vask: orderBook.bfitickask.v,
          snbid: orderBook.brextickbid.sn,
          snask: orderBook.bfitickask.sn
        },
        sreadbfiba: {
          pbid: orderBook.bfitickbid.p,
          pask: orderBook.bfitickask.p,
          pdif: orderBook.bfitickbid.p - orderBook.bfitickask.p,
          vbid: orderBook.bfitickbid.v,
          vask: orderBook.bfitickask.v
        }
      },
      brexask: {
        comp_abrexbk: {
          pbid: orderBook.ktickbid.p,
          pask: orderBook.brextickask.p,
          pdif: orderBook.ktickbid.p - orderBook.brextickask.p,
          sndif: orderBook.ktickbid.sn - orderBook.brextickask.sn,
          bidMk: 'ktickbid',
          askMk: 'brextickask',
          vbid: orderBook.ktickbid.v,
          vask: orderBook.brextickask.v,
          snbid: orderBook.ktickbid.sn,
          snask: orderBook.brextickask.sn
        },
        comp_abrexbbs: {
          pbid: orderBook.bstickbid.p,
          pask: orderBook.brextickask.p,
          pdif: orderBook.bstickbid.p - orderBook.brextickask.p,
          sndif: orderBook.bstickbid.sn - orderBook.brextickask.sn,
          bidMk: 'bstickbid',
          askMk: 'brextickask',
          vbid: orderBook.bstickbid.v,
          vask: orderBook.brextickask.v,
          snbid: orderBook.bstickbid.sn,
          snask: orderBook.brextickask.sn
        },
        comp_abrexbitb: {
          pbid: orderBook.itbtickbid.p,
          pask: orderBook.brextickask.p,
          pdif: orderBook.itbtickbid.p - orderBook.brextickask.p,
          sndif: orderBook.itbtickbid.sn - orderBook.brextickask.sn,
          bidMk: 'itbtickbid',
          askMk: 'brextickask',
          vbid: orderBook.itbtickbid.v,
          vask: orderBook.brextickask.v,
          snbid: orderBook.itbtickbid.sn,
          snask: orderBook.brextickask.sn
        },
        comp_abrexbbfi: {
          pbid: orderBook.bfitickbid.p,
          pask: orderBook.brextickask.p,
          pdif: orderBook.bfitickbid.p - orderBook.brextickask.p,
          sndif: orderBook.bfitickbid.sn - orderBook.brextickask.sn,
          bidMk: 'bfitickbid',
          askMk: 'brextickask',
          vbid: orderBook.bfitickbid.v,
          vask: orderBook.brextickask.v,
          snbid: orderBook.bfitickbid.sn,
          snask: orderBook.brextickask.sn
        },
        sreadbrexba: {
          pbid: orderBook.brextickbid.p,
          pask: orderBook.brextickask.p,
          pdif: orderBook.brextickbid.p - orderBook.brextickask.p,
          vbid: orderBook.brextickbid.v,
          vask: orderBook.brextickask.v
        }
      },
      kask: {
        comp_akbbs: {
          pbid: orderBook.bstickbid.p,
          pask: orderBook.ktickask.p,
          pdif: orderBook.bstickbid.p - orderBook.ktickask.p,
          sndif: orderBook.bstickbid.sn - orderBook.ktickask.sn,
          bidMk: 'bstickbid',
          askMk: 'ktickask',
          vbid: orderBook.bstickbid.v,
          vask: orderBook.ktickask.v,
          snbid: orderBook.bstickbid.sn,
          snask: orderBook.ktickask.sn
        },
        comp_akbitb: {
          pbid: orderBook.itbtickbid.p,
          pask: orderBook.ktickask.p,
          pdif: orderBook.itbtickbid.p - orderBook.ktickask.p,
          sndif: orderBook.itbtickbid.sn - orderBook.ktickask.sn,
          bidMk: 'itbtickbid',
          askMk: 'ktickask',
          vbid: orderBook.itbtickbid.v,
          vask: orderBook.ktickask.v,
          snbid: orderBook.itbtickbid.sn,
          snask: orderBook.ktickask.sn
        },
        comp_akbbrex: {
          pbid: orderBook.brextickbid.p,
          pask: orderBook.ktickask.p,
          pdif: orderBook.brextickbid.p - orderBook.ktickask.p,
          sndif: orderBook.brextickbid.sn - orderBook.ktickask.sn,
          bidMk: 'brextickbid',
          askMk: 'ktickask',
          vbid: orderBook.brextickbid.v,
          vask: orderBook.ktickask.v,
          snbid: orderBook.brextickbid.sn,
          snask: orderBook.ktickask.sn
        },
        comp_akbbfi: {
          pbid: orderBook.bfitickbid.p,
          pask: orderBook.ktickask.p,
          pdif: orderBook.bfitickbid.p - orderBook.ktickask.p,
          sndif: orderBook.bfitickbid.sn - orderBook.ktickask.sn,
          bidMk: 'bfitickbid',
          askMk: 'ktickask',
          vbid: orderBook.bfitickbid.v,
          vask: orderBook.ktickask.v,
          snbid: orderBook.bfitickbid.sn,
          snask: orderBook.ktickask.sn
        },
        spreadkba: {
          pbid: orderBook.ktickbid.p,
          pask: orderBook.ktickask.p,
          pdif: orderBook.ktickbid.p - orderBook.ktickask.p,
          vbid: orderBook.ktickbid.v,
          vask: orderBook.ktickask.v
        }
      },
      itbask: {
        comp_aitbbbrex: {
          pbid: orderBook.brextickbid.p,
          pask: orderBook.itbtickask.p,
          pdif: orderBook.brextickbid.p - orderBook.itbtickask.p,
          sndif: orderBook.brextickbid.sn - orderBook.itbtickask.sn,
          bidMk: 'brextickbid',
          askMk: 'itbtickask',
          vbid: orderBook.brextickbid.v,
          vask: orderBook.itbtickask.v,
          snbid: orderBook.brextickbid.sn,
          snask: orderBook.itbtickask.sn
        },
        comp_aitbbk: {
          pbid: orderBook.ktickbid.p,
          pask: orderBook.itbtickask.p,
          pdif: orderBook.ktickbid.p - orderBook.itbtickask.p,
          sndif: orderBook.ktickbid.sn - orderBook.itbtickask.sn,
          bidMk: 'ktickbid',
          askMk: 'itbtickask',
          vbid: orderBook.ktickbid.v,
          vask: orderBook.itbtickask.v,
          snbid: orderBook.ktickbid.sn,
          snask: orderBook.itbtickask.sn
        },
        comp_aitbbbs: {
          pbid: orderBook.bstickbid.p,
          pask: orderBook.itbtickask.p,
          pdif: orderBook.bstickbid.p - orderBook.itbtickask.p,
          sndif: orderBook.bstickbid.sn - orderBook.itbtickask.sn,
          bidMk: 'bstickbid',
          askMk: 'itbtickask',
          vbid: orderBook.bstickbid.v,
          vask: orderBook.itbtickask.v,
          snbid: orderBook.bstickbid.sn,
          snask: orderBook.itbtickask.sn
        },
        comp_aitbbfi: {
          pbid: orderBook.bfitickbid.p,
          pask: orderBook.itbtickask.p,
          pdif: orderBook.bfitickbid.p - orderBook.itbtickask.p,
          sndif: orderBook.bfitickbid.sn - orderBook.itbtickask.sn,
          bidMk: 'bfitickbid',
          askMk: 'itbtickask',
          vbid: orderBook.bfitickbid.v,
          vask: orderBook.itbtickask.v,
          snbid: orderBook.bfitickbid.sn,
          snask: orderBook.itbtickask.sn
        },
        spreaditb: {
          pbid: orderBook.itbtickbid.p,
          pask: orderBook.itbtickask.p,
          pdif: orderBook.itbtickbid.p - orderBook.itbtickask.p,
          vbid: orderBook.itbtickbid.v,
          vask: orderBook.itbtickask.v
        }
      },
      bsask: {
        comp_absbitb: {
          pbid: orderBook.itbtickbid.p,
          pask: orderBook.bstickask.p,
          pdif: orderBook.itbtickbid.p - orderBook.bstickask.p,
          sndif: orderBook.itbtickbid.sn - orderBook.bstickask.sn,
          bidMk: 'itbtickbid',
          askMk: 'bstickask',
          vbid: orderBook.itbtickbid.v,
          vask: orderBook.bstickask.v,
          snbid: orderBook.itbtickbid.sn,
          snask: orderBook.bstickask.sn
        },
        comp_absbk: {
          pbid: orderBook.ktickbid.p,
          pask: orderBook.bstickask.p,
          pdif: orderBook.ktickbid.p - orderBook.bstickask.p,
          sndif: orderBook.ktickbid.sn - orderBook.bstickask.sn,
          bidMk: 'ktickbid',
          askMk: 'bstickask',
          vbid: orderBook.ktickbid.v,
          vask: orderBook.bstickask.v,
          snbid: orderBook.ktickbid.sn,
          snask: orderBook.bstickask.sn
        },
        comp_absbbrex: {
          pbid: orderBook.brextickbid.p,
          pask: orderBook.bstickask.p,
          pdif: orderBook.brextickbid.p - orderBook.bstickask.p,
          sndif: orderBook.brextickbid.sn - orderBook.bstickask.sn,
          bidMk: 'brextickbid',
          askMk: 'bstickask',
          vbid: orderBook.brextickbid.v,
          vask: orderBook.bstickask.v,
          snbid: orderBook.brextickbid.sn,
          snask: orderBook.bstickask.sn
        },
        comp_absbbfi: {
          pbid: orderBook.bfitickbid.p,
          pask: orderBook.bstickask.p,
          pdif: orderBook.bfitickbid.p - orderBook.bstickask.p,
          sndif: orderBook.bfitickbid.sn - orderBook.bstickask.sn,
          bidMk: 'bfitickbid',
          askMk: 'bstickask',
          vbid: orderBook.bfitickbid.v,
          vask: orderBook.bstickask.v,
          snbid: orderBook.bfitickbid.sn,
          snask: orderBook.bstickask.sn
        },
        spread_bsba: {
          pbid: orderBook.bstickbid.p,
          pask: orderBook.bstickask.p,
          pdif: orderBook.bstickbid.p - orderBook.bstickask.p,
          vbid: orderBook.bstickbid.v,
          vask: orderBook.bstickask.v
        }
      }
    }
  });

  // NOTE: Saving comparision to the Database:

  dif.save(function(err, dif) {
    if (err) return console.log(err);
    console.log('Comparision instance saved!');
  });

  // NOTE: Creating the new order to be passed the different markets

  var refsn = Math.floor(new Date()) / 1000;
  Object.keys(dif.comp).forEach(k => {
    Object.keys(dif.comp[k]).forEach(p => {
      if (
        dif.comp[k][p].pdif >= minimumGain &&
        dif.comp[k][p].sndif <= maxTimeout
      ) {
        var newOrder = new orderToPass({
          volAsk: dif.comp[k][p].vask,
          volBid: dif.comp[k][p].vbid,
          pDif: dif.comp[k][p].pdif,
          pAsk: dif.comp[k][p].pask,
          pBid: dif.comp[k][p].pbid,
          bidMk: dif.comp[k][p].bidMk,
          askMk: dif.comp[k][p].askMk,
          snDif: dif.comp[k][p].snbid - dif.comp[k][p].snask,
          sn: refsn
        });

        // NOTE: Saving order to be passed to the Database:

        newOrder.save(function(err, dif) {
          if (err) return console.log(err);
          console.log('Order to be passed saved!');

          // NOTE: Getting everything into an Array for manipulation:
          orderTP.push(newOrder);
        });
      }
    });
  });
  orderTP.map(x => {
    if (x.volBid < x.volAsk) {
      var orderBuy = x.volBid * x.pAsk;
      var orderSell = x.volBid * x.pBid;
      console.log(
        `Buy @ $${x.pAsk} & Sell @$${x.pBid} - Profit: ${orderSell - orderBuy}`
      );
    } else if (x.volAsk < x.volBid) {
      var orderBuy = x.volAsk * x.pAsk;
      var orderSell = x.volAsk * x.pBid;
      console.log(
        `Buy @ $${x.pAsk} & Sell @$${x.pBid} - Profit: ${orderSell - orderBuy}`
      );
    }
  });
  // NOTE: ToDo:
  // - volAsk > volBid
  // - pDif max
  // - snDif min
}, 1100);
