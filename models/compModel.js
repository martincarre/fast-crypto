var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
require('mongoose-currency').loadType(mongoose);

var compSchema = mongoose.Schema({
  iname: String,
  comp: Object,
  n: Object,
  sn: Object,
  qid: Object,
  ob: Object
});

var compRecord = mongoose.model('compRecord', compSchema);

module.exports = {
  compRecord
};
