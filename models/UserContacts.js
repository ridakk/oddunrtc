var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userContactsSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  contacts: Array
});

module.exports = mongoose.model('UserContacts', userContactsSchema);
