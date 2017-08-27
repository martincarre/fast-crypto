var apiRequest = require('./apiRequest.js').apiRequest;


  // ===== GET SINGLE TICKER AND ADAPT TO LAYOUT HANDLER:

function blockchaininfo() {
  return apiRequest().then((res) => {
      var result = {};
      var body = res.body;
      var timeStamp = Math.floor(new Date());
      result= {
            mk: 'blockchaininfo',
            c: body.market_price_usd,
            hash_rate: body.hash_rate,
            total_fees_btc: body.total_fees_btc,
            n_btc_mined: body.n_btc_mined,
            n_tx: body.n_tx,
            n_blocks_mined: body.n_blocks_mined,
            minutes_between_blocks: body.minutes_between_blocks,
            totalbc: body.totalbc,
            n_blocks_total: body.n_blocks_total,
            estimated_transaction_volume_usd: body.estimated_transaction_volume_usd,
            blocks_size: body.blocks_size,
            miners_revenue_usd: body.miners_revenue_usd,
            nextretarget: body.nextretarget,
            difficulty: body.difficulty,
            estimated_btc_sent: body.estimated_btc_sent,
            miners_revenue_btc: body.miners_revenue_btc,
            total_btc_sent: body.total_btc_sent,
            trade_volume_btc: body.trade_volume_btc,
            trade_volume_usd: body.trade_volume_usd,
            sn: body.timestamp,
            n: timeStamp,
      }
      return result;
  })
};


module.exports = {
  blockchaininfo
}
