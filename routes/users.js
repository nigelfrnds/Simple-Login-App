var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var router = express.Router();

var UserController = require('../controllers/UserController');

router.get('/register', (req, res) => {
  res.render('register');
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/register', UserController.registerUser);

passport.use(new LocalStrategy(UserController.loginUser));

passport.serializeUser((user, done) => {
  done(null,user.id);
});

passport.deserializeUser((id, done) => {
  User.getUserById(id, (err, user) => {
    done(err, user);
  });
});

router.post(
  '/login',
  passport.authenticate('local', {successRedirect: '/', failureRedirect: '/users/login', failureFlash: true}),
  (req,res) => {
    res.redirect('/');
});

router.get('/logout', (req,res) => {
  req.logout();
  req.flash('success_msg', 'Logged out!');
  res.redirect('/users/login');
});

module.exports = router;
