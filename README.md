This a second version of the fast trading crypto app.

List of known bugs:
 * I know there's a problem with the statusCode response for Bitstamp and Kraken: 429 is Bitfinex's error handler for too many requests. This line: `if (data.indexOf(429) > -1) {` needs to be adapted for both exchanges.
