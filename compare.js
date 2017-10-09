const mongo = require('mongodb');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const server = mongoose.connect('mongodb://localhost/cryptoCollection', {
  useMongoClient: true
});

const { Krakentick } = require('./kraken/model/krakenModel');
const { Bitstamptick } = require('./bitstamp/model/bitstampModel');
var now = Math.floor(new Date());

function bquery() {
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
setInterval(async function() {
  var ktick = await kquery();
  var btick = await bquery();
  var dif = {
    difc: ktick.c - btick.c,
    ditn: ktick.n - btick.n,
    difa: ktick.a - btick.a,
    difb: ktick.b - btick.b,
    kbaspread: ktick.a - ktick.b,
    bbaspread: btick.a - btick.b,
    baspread: ktick.a - btick.a - (ktick.b - btick.b),
    kn: ktick.n,
    bn: btick.n
  };

  console.log(JSON.stringify(dif, null, 3));
}, 1100);
