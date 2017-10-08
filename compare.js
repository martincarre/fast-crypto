const mongo = require('mongodb');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const server = mongoose.connect('mongodb://localhost/cryptoCollection', {
  useMongoClient: true
});

const { Krakentick } = require('./kraken/model/krakenModel');
const { Bitstamptick } = require('./bitstamp/model/bitstampModel');
var now = Math.floor(new Date());

function kquery() {
  return new Promise((resolve, reject) => {
    Krakentick.findOne(
      {
        iname: 'btcusd',
        n: { $lt: now }
      },
      'mk c n',
      function(err, tick) {
        if (err) {
          reject(err);
        } else {
          resolve(tick);
        }
      }
    );
  });
}

function bquery() {
  Bitstamptick.findOne({}, {}, { sort: { created_at: -1 } }, function(
    err,
    tick
  ) {
    console.log(tick);
  });
}

bquery();

// async function compare() {
//   var ktick = await kquery();
//   var btick = await bquery();
//   var dif = {
//     difc: ktick.c - btick.c,
//     ditn: ktick.n - btick.n,
//     kn: ktick.n,
//     bn: btick.n
//   };

//   console.log(JSON.stringify(dif, null, 3));
// }

// compare();
