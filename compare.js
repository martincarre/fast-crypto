function compare(data) {
  if (data.mk === 'bitstamp' && data.name === 'btcusd') {
    var bsObj = data;
    console.log(JSON.stringify(data, null, 3));
  } else if (data.mk === 'bitfinex') {
    var bfObj = data;
  } else if (data.mk === 'kraken' && data.name === 'XBTUSD') {
    var krObj = data;
    console.log(JSON.stringify(data, null, 3));
  }
}

module.exports = {
  compare
}
