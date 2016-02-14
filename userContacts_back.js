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

var UserContacts = mongoose.model('UserContacts', userContactsSchema);

// make this available to our users in our Node applications
module.exports = UserContacts;
