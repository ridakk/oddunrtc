var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

// create a schema
var contactsSchema = new Schema({
  uuid: String,
  friends: Array
});

contactsSchema.methods.isFriendAvailable = function(uuid) {
  for (var i in this.friends) {
    if (this.friends.hasOwnProperty(i)) {
      if (this.friends[i].uuid === uuid) {
        return true;
      }
    }
  }
  return false;
};

contactsSchema.methods.removeFriend = function(uuid) {
  for (var i in this.friends) {
    if (this.friends.hasOwnProperty(i)) {
      if (this.friends[i].uuid === uuid) {
        this.friends.splice(i,1);
        return
      }
    }
  }
};

module.exports = mongoose.model('contacts', contactsSchema);
