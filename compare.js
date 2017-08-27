var mongo = require('mongodb');
var mongoose = require('mongoose');
  mongoose.Promise = global.Promise;
var server = mongoose.connect('mongodb://localhost/cryptoCollection', {
  useMongoClient: true,
});
var Bitfinextick = require('./bitfinex/model/bitfinexModel').Bitfinextick;
var now = Math.floor(new Date()) / 1000 ;

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
});

Bitfinextick.find({
  iname: 'btcusd',
  sn: { $gt: now - 3600, $lt: now}
}).then((Bitfinexticks) => {
  for (var i = 0; i < Bitfinexticks.length -1; i++) {
    if (i === 0) {
      console.log('First iteration');
    } else {
    var logReturn = ((Bitfinexticks[i].c/Bitfinexticks[i - 1].c) - 1) * 100 // TO ADAPT TO LOG RETURN CF WIKIPEDIA ON LOGS
    console.log(`${change}%`);
    }
  }
});
