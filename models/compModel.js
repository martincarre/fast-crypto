var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
require('mongoose-currency').loadType(mongoose);

var compSchema = mongoose.Schema({
  comp: Object
});

var compRecord = mongoose.model('compRecord', compSchema);

module.exports = {
  compRecord
};
