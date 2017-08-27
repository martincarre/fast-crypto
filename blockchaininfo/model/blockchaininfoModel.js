var mongoose = require('mongoose');
  mongoose.Promise = global.Promise;
  require('mongoose-currency').loadType(mongoose);
var Currency = mongoose.Types.Currency;

var compare = require('../../compare').compare;

var tickerSchema = mongoose.Schema({
  mk: String,
  c: Currency,
  hash_rate: Number,
  total_fees_btc: Currency,
  n_btc_mined: Number,
  n_tx: Number,
  n_blocks_mined: Number,
  minutes_between_blocks: Number,
  totalbc: Number,
  n_blocks_total: Number,
  estimated_transaction_volume_usd: Currency,
  blocks_size: Number,
  miners_revenue_usd: Currency,
  nextretarget: Number,
  difficulty: Number,
  estimated_btc_sent: Number,
  miners_revenue_btc: Number,
  total_btc_sent: Number,
  trade_volume_btc: Number,
  trade_volume_usd: Currency,
  sn: Number,
  n: Number,
  iname: String,
});

tickerSchema.methods.sendToCompare = function () {
  compare(this);
}

var Blockchaininfotick = mongoose.model('Blockchaininfo', tickerSchema);

module.exports = {
  Blockchaininfotick
}
