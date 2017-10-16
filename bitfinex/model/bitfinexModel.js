var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
require('mongoose-currency').loadType(mongoose);
var Currency = mongoose.Types.Currency;

// var compare = require('../../compare').compare;

var tickerSchema = mongoose.Schema({
  mk: String,
  name: String,
  a: Currency,
  b: Currency,
  m: Currency,
  c: Currency,
  v: Number,
  l: Currency,
  h: Currency,
  sn: Number,
  n: Number,
  iname: String,
  order: Object
});

// tickerSchema.methods.sendToCompare = function () {
//   compare(this);
// }

var Bitfinextick = mongoose.model('Bitfinextick', tickerSchema);

module.exports = {
  Bitfinextick
};
