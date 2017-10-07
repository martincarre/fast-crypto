var mongo = require('mongodb');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var server = mongoose.connect('mongodb://localhost/cryptoCollection', {
  useMongoClient: true
});
const { Bitfinextick } = require('./bitfinex/model/bitfinexModel');
var math = require('mathjs');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {});

setInterval(function() {
  var now = Math.floor(new Date()) / 1000;
  Bitfinextick.find({
    iname: 'btcusd',
    sn: { $gt: now - 60 * 60 * 24, $lt: now }
  }).then(Bitfinexticks => {
    var retArr = [];
    var volat = 0;
    var logReturn = 0;
    for (var i = 0; i < Bitfinexticks.length - 1; i++) {
      if (i === 0) {
        logReturn = null;
      } else {
        logReturn = Math.log(Bitfinexticks[i].c / Bitfinexticks[i - 1].c);
        retArr.push(logReturn);
      }
    }
    volat = math.std(retArr) * math.sqrt(365) * 100;
    console.log(`[SIG][48H]: ${volat}%`);
  });
}, 4000);
