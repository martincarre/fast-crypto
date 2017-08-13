var mongoose = require('mongoose');
  mongoose.Promise = global.Promise;

var compare = require('../../compare').compare;

var tickerSchema = mongoose.Schema({
  mk: String,
  name: String,
  a: Array,
  b: Array,
  c: Array,
  v: Array,
  p: Array,
  t: Array,
  l: Array,
  h: Array,
  o: Number,
  n: Number,
  iname: String,
});

tickerSchema.methods.sendToCompare = function () {
  compare(this);
}

var Krakentick = mongoose.model('Krakentick', tickerSchema);

module.exports = {
  Krakentick
}
