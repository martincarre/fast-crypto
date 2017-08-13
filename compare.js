function compare(data) {
  if (data.mk === 'bitstamp' && data.name === 'btcusd') {
    var bsObj = data;
    console.log(JSON.stringify(data, null, 3));
  } else if (data.mk === 'bitfinex') {
    var bfObj = data;
  } else if (data.mk === 'kraken') {
    var krObj = data;
  }
}

module.exports = {
  compare
}
