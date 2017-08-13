var mongoose = require('mongoose');
  mongoose.Promise = global.Promise;

var compare = require('../../compare').compare;

var tickerSchema = mongoose.Schema({
  mk: String,
  name: String,
  a: Number,
  b: Number,
  c: Number,
  v: Number,
  p: Number,
  l: Number,
  h: Number,
  o: Number,
  n: Number,
});

tickerSchema.methods.sendToCompare = function () {
  compare(this);
}

var Bitstamptick = mongoose.model('Bitstamptick', tickerSchema);

module.exports = {
  Bitstamptick
}
