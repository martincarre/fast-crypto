var mongoose = require('mongoose');
  mongoose.Promise = global.Promise;

var compare = require('../../compare').compare;

var tickerSchema = mongoose.Schema({
  mk: String,
  name: String,
  a: Number,
  b: Number,
  m: Number,
  c: Number,
  v: Number,
  l: Number,
  h: Number,
  sn: Number,
  n: Number,
  iname: String,
});

tickerSchema.methods.sendToCompare = function () {
  compare(this);
}

var Bitfinextick = mongoose.model('Bitfinextick', tickerSchema);

module.exports = {
  Bitfinextick
}
