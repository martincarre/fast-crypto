var mongoose = require('mongoose');
  mongoose.Promise = global.Promise;

var tickerSchema = mongoose.Schema({
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

var Bitstamptick = mongoose.model('Bitstamptick', tickerSchema);


module.exports = {
  Bitstamptick
}
