var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  bcrypt = require('bcrypt-nodejs');

// create a schema
var userSchema = new Schema({
  uuid: String,
  id: String,
  type: String,
  token: String,
  displayName: String,
  username: String,
  photo: String,
  email: String,
  password: String,
  name: String
});

userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
