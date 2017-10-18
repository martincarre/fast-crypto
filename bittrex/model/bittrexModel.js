var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
require('mongoose-currency').loadType(mongoose);
var Currency = mongoose.Types.Currency;

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
  sn: Date,
  n: Number,
  iname: String,
  OpenBuyOrders: Number,
  OpenSellOrders: Number,
  order: Array
});

var Bittrextick = mongoose.model('Bittrextick', tickerSchema);

module.exports = {
  Bittrextick
};
