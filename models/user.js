var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: {
    type: String,
    index: true
  },
  name: String,
  password: String,
  email: String,
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = (newUser, callback) => {
  bcrypt.genSalt(10, function(err,salt) {
    bcrypt.hash(newUser.password, salt, function(err,hash) {
      newUser.password = hash;
      newUser.save(callback);
    });
  });
}

module.exports.getUserById = (id, callback) => {
  User.findById(id, callback);
};

module.exports.getUserByUsername = (username, callback) => {
  User.findOne({ username: username }, callback);
};

module.exports.comparePassword = (candidatePassword, hash, callback) => {
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if(err) throw err;
    callback(null, isMatch);
  });
};
