# Getting Started:
  - Use Mongodb. You will need to start a mongo server from the localhost: `$mongod --dbpath =XXXX etc...`
  - Once the server launched, use main.js to get the info back from the requests and populate the database. `$node main.js`
  - Use compare.js to start comparing the latest info from the various exchanges. `$node compare.js`


  *Each Exchange has its own collection and related model. We tried to include as much information as possible even if not every exchange provides the same amount of info.*

## List of known bugs:
 * The error logs are not working properly ==> WORK IN PROGRESS... NOT WORKING FOR SOME REASON. NOT VITAL TO THE PROGRAM BUT IT WOULD BE GREAT IF WE COULD INCLUDE SOME KIND OF AUTOMATIC MAIL SENT FROM THE SERVER IN CASE OF A PROBLEM.
 * Not able to include Exmo market yet. Problem with the returned data: Gives an array that I would have to save each items separately. The solution might reside in giving a Map function to save each ticker separately... Still have to work on it.
 * We should improve the timeStamps since Mongoose supports it directly within the model: https://stackoverflow.com/questions/10006218/which-schematype-in-mongoose-is-best-for-timestamp.
 * Working on compare prices between markets to include them in a new DB or new collection. WORK IN PROGRESS (compare.js)
