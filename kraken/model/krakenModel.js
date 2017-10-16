const mongoose = require('mongoose');
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
  n: Number,
  sn: Number,
  iname: String,
  aAmt: Number,
  bAmt: Number,
  cAmt: Number,
  v24: Currency,
  h24: Currency,
  l24: Currency,
  p24: Currency
});

var Krakentick = mongoose.model('Krakentick', tickerSchema);

module.exports = {
  Krakentick
};
