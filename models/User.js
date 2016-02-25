var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

// create a schema
var userSchema = new Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  photo: String
});

module.exports = mongoose.model('User', userSchema);
