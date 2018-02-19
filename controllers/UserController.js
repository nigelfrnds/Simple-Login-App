var User = require('../models/user');

exports.registerUser = (req,res) => {
  const { name, email, username, password, password2 }= req.body;

  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(password);

  var errors = req.validationErrors();

  if(errors) {
    res.render('register', {
      errors: errors
    });
  } else {
    var newUser = new User({
      name, email, username, password
    });

    User.createUser(newUser, (err, user) => {
      if(err) throw err;
      console.log(user);
    });

    req.flash('success_msg', 'You are registered!');
    res.redirect('/users/login');
  }
};

// function for passport
exports.loginUser = (username,password, done) => {
  User.getUserByUsername(username, (err, user) => {
    if(err) throw err;
    if(!user) {
      return done(null, false, { message: 'Unknown User' });
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      if(err) throw err;
      if(isMatch) {
        return done(null,user);
      } else {
        return done(null,false, { message: 'Invalid password'});
      }
    });
  });
};
