var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

// create a schema
var userSchema = new Schema({
  uuid: String,
  id: String,
  token: String,
  displayName: String,
  username: String,
  photo: String,
  email: String,
  password: String,
  name: String
});

module.exports = mongoose.model('User', userSchema);
