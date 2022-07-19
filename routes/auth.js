var express = require('express');
var passport = require('passport');
const LocalStrategy = require("passport-local").Strategy;
var User = require('../models/User')
var router = express.Router();
const bcrypt = require('bcryptjs');  
const { body, validationResult } = require('express-validator');
// configure Local strategy
  passport.use(
    new LocalStrategy((username, password, done) => {
      User.findOne({ username: username }, (err, user) => {
        if (err) { 
          return done(err);
        }
        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        }
        bcrypt.compare(password,user.password , function(err,success){
          if(err){
            return done(null, false, { message: "Incorrect password" });
          } else {
            return done(null, user);

          }
     
      });

    })}))

    passport.serializeUser(function(user, done) {
      done(null, user.id);
    });
    
    passport.deserializeUser(function(id, done) {
      User.findById(id, function(err, user) {
        done(err, user);
      });
    });

router.get('/login', function(req, res, next) {
  res.render('login');
});
router.get('/signup', function(req, res, next) {
    res.render('signup');
  });
router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  })
)
router.post('/signup',
body("username").custom(value => {
    return User.find({
        username: value
    }).then(user => {
        if (user.length > 0) {
            // Custom error message and reject
            // the promise
            return Promise.reject('Username already in use');
        }
    });
})
  ,
  body('password').isLength({ min: 8})
  .withMessage('must be at least 8 chars long')
  .matches(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})"))
  .withMessage('must contains at least a numeric , a lowercase ,an uppercase and a special character'),
  body('cpassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Password confirmation does not match password');
    }

    // Indicates the success of this synchronous custom validator
    return true;
  }),
    async  function(req, res, next) {      // Finds the validation errors in this request and wraps them in an object with handy functions
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.render('signup',{ errors: errors.array() });
      }
    const user=await User.create({
        username:req.body.username,
        password:req.body.password,
        fullname:req.body.fullname
    })
    
    req.login(user, function(err) {
        if (err) { return next(err); }
        res.redirect('/');
      });
  });
router.all('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
  });   
  
module.exports = router;