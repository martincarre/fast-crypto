This a second version of the fast trading crypto app.

List of known bugs:
 * I know there's a problem with the statusCode response for Bitstamp and Kraken: 429 is Bitfinex's error handler for too many requests. This line: `if (data.indexOf(429) > -1) {` needs to be adapted for both exchanges. ===> DELETED NORMALLY.
 * You might have to create a log folder to the root of the app. I'm not sure yet if git ignored it or not (sorry I'm a little new to all this...) ==> WORK IN PROGRESS... [08.27.2017] SEEMS TO BE WORKING TO SOME EXTENT. STILL I WOULD HAVE TO ADAPT FOR EACH MARKET: STILL WORK IN PROGRESS.
  - Problem with bitfinex: Current code gives an error (unhandled PromiseRejection: UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 1): TypeError: Cannot convert undefined or null to object) =====> [08.27.2017]Seems to be solved by the setInterval.
 * Not able to include Exmo market yet. Problem with the returned data: Gives an array that I would have to save each items separately. The solution might reside in giving a Map function to save each ticker separately... Still have to work on it.
