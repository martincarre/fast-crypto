This a second version of the fast trading crypto app.

List of known bugs:
 * The error logs are not working properly ==> WORK IN PROGRESS... [08.27.2017] SEEMS TO BE WORKING TO SOME EXTENT. STILL I WOULD HAVE TO ADAPT FOR EACH MARKET: STILL WORK IN PROGRESS.
  - Problem with bitfinex: Current code gives an error (unhandled PromiseRejection: UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 1): TypeError: Cannot convert undefined or null to object) =====> [08.27.2017]Seems to be solved by the setInterval.
 * Not able to include Exmo market yet. Problem with the returned data: Gives an array that I would have to save each items separately. The solution might reside in giving a Map function to save each ticker separately... Still have to work on it.
 * Should improve the timeStamps since Mongoose supports it directly within the model: https://stackoverflow.com/questions/10006218/which-schematype-in-mongoose-is-best-for-timestamp.
 * Working on compare prices between markets (compare.js)
