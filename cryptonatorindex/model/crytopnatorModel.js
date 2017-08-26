var mongoose = require('mongoose');
  mongoose.Promise = global.Promise;
  require('mongoose-currency').loadType(mongoose);
var Currency = mongoose.Types.Currency;

var compare = require('../../compare').compare;

var tickerSchema = mongoose.Schema({
  mk: String,
  name: String,
  c: Currency,
  v: Number,
  sn: Number,
  n: Number,
  iname: String,
  base: Object,
});

tickerSchema.methods.sendToCompare = function () {
  compare(this);
}

var Cryptonatortick = mongoose.model('Cryptonatortick', tickerSchema);

module.exports = {
  Cryptonatortick
}
