var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
require('mongoose-currency').loadType(mongoose);

var orderTPSchema = mongoose.Schema({
  volAsk: Number,
  volBid: Number,
  pDif: Number,
  pAsk: Number,
  pBid: Number,
  bidMk: String,
  askMk: String,
  sn: Number
});

var orderToPass = mongoose.model('orderToPass', orderTPSchema);

module.exports = {
  orderToPass
};
