var mongoose = require('mongoose');
  mongoose.Promise = global.Promise;
  require('mongoose-currency').loadType(mongoose);
var Currency = mongoose.Types.Currency;

var compare = require('../../compare').compare;

var tickerSchema = mongoose.Schema({
  mk: String,
  name: String,
  a: Currency,
  b: Currency,
  c: Currency,
  v: Number,
  p: Number,
  l: Currency,
  h: Currency,
  o: Currency,
  sn: Number,
  n: Number,
  iname: String,
});

tickerSchema.methods.sendToCompare = function () {
  compare(this);
}

var Bitstamptick = mongoose.model('Bitstamptick', tickerSchema);

module.exports = {
  Bitstamptick
}
