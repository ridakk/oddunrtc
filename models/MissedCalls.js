var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

// create a schema
var missedCallsSchema = new Schema({
  uuid: String,
  missed: Array
});

module.exports = mongoose.model('missedCalls', missedCallsSchema);
