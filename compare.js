const mongo = require('mongodb');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const server = mongoose.connect('mongodb://localhost/cryptoCollection', {
  useMongoClient: true
});

const { Krakentick } = require('./kraken/model/krakenModel');
var now = Math.floor(new Date());

function kquery() {
  return new Promise(function(reslove, reject) {
    Krakentick.findOne(
      {
        iname: 'btcusd',
        n: { $lt: now }
      },
      'mk c n',
      function(err, tick) {
        if (err) {
          return console.log(err);
        } else {
          return tick;
        }
      }
    )(function(err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
  };
}

kquery();

// async function compare() {
//   var ktick = await kquery();
//   console.log(ktick);
// }
//
// compare();
