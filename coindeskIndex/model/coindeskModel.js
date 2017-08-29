var mongoose = require('mongoose');
  mongoose.Promise = global.Promise;
  require('mongoose-currency').loadType(mongoose);
var Currency = mongoose.Types.Currency;

// var compare = require('../../compare').compare;

var tickerSchema = mongoose.Schema({
  mk: String,
  name: String,
  c: Currency,
  sn: Date,
  n: Number,
  iname: String,
});

// tickerSchema.methods.sendToCompare = function () {
//   compare(this);
// }

var Coindesktick = mongoose.model('CoindeskBPI', tickerSchema);

module.exports = {
  Coindesktick
}
