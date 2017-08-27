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
 Bitfinexticks.forEach((object) => {
   
 })
});
