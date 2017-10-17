# Getting Started:
  - Requires **Mongodb**. You will need to start a mongo server from the localhost: `$mongod --dbpath =XXXX etc...`
  - Once the server launched, use **main.js** to get the info back from the requests and populate the database. `$node main.js`
  - Use **compare.js** to start comparing the latest info from the various exchanges. `$node compare.js`
  - **volCrypto.js** is a work in progress and probably doesn't work anymore. The objective being to create some kind of a pricing model in the future.


  *Each Exchange has its own collection and related model. We tried to include as much information as possible even if not every exchange provides the same amount of info.*

## List of known bugs/ToDo:
 * **Market Requests:**
    - The error logs are not working properly ==> NOT WORKING FOR SOME OBSCURE REASON. NOT VITAL TO THE PROGRAM BUT IT WOULD BE GREAT IF WE COULD INCLUDE SOME KIND OF AUTOMATIC MAIL SENT FROM THE SERVER IN CASE OF A PROBLEM.
    - Not able to include *Exmo* market yet. Problem with the returned data: Gives an array that I would have to save each items separately. The solution might reside in giving a Map function to save each ticker separately... Still have to work on it.
    - The requests are not optimized as is since I'm only doing requests on a single market. There's no need for an array anymore but at this point, I don't feel like redoing the code to delete the list option (array). Plus, it might be usefull in the future... The only thing is that for the order book I didn't adapt. The "list" is "hardcoded"

 * **main.js:**
    - Improve the timeStamps since Mongoose supports it directly within the models: https://stackoverflow.com/questions/10006218/which-schematype-in-mongoose-is-best-for-timestamp.

 * **compare.js:**
    - Working on comparing prices between markets and take positions. Include everything in a new DB or new collection. WORK IN PROGRESS
    - At the moment, I'm only querying the DB and then creating a new record but I need to be able to reference some of the information from the data that already exists in the DB... For instance, the orderbooks are both being saved under each respective ticker and then in the compRecord. I need to find out how I can use references instead of duplicating the data.

## Other info:

This is currently running on a Raspberry Pi 3 Model B with pi64 OS (for the mongodb support): https://github.com/bamarni/pi64.
I seem to be having troubles with the Raspberry Pi and Mongodb. Everything works correctly up to some point. I believe that the raspberry memory is too low and that Mongodb crashes when it fills the RAM...
