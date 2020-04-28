const User = require('../models/user');
const bycrypt = require('bcryptjs');

const { body, validationResult } = require('express-validator');

exports.sign_up_get = function (req, res, next) {
  res.render('signup', { title: 'Sign Up' });
}

exports.sign_up_post = [
  // validate
  body('firstname', 'First name must be present').isLength({ min: 1 }).trim().escape(),
  body('lastname', 'Last name must be present').isLength({ min: 1 }).trim().escape(),
  body('password', 'Password required').isLength({ min: 6 }),
  body('username', 'Invalid email').isEmail().normalizeEmail(),
  body('passwordconfirm').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Password confirmation does not match password');
    }
    return true;
  }),
  function (req, res, next) {
    bycrypt.hash(req.body.password, 10, (err, hashedPassword) => {
      if (err) { return next(err); }

      const user = new User({
        first_name: req.body.firstname,
        last_name: req.body.lastname,
        username: req.body.username,
        password: hashedPassword,
        admin: false,
        member: false
      })

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.render('signup', { title: 'Sign Up', errors: errors.array() });
      } else {
        user.save((err) => {
          if (err) {
            return next(err);
          }
          req.login(user, function(err) {
            if (err) { return next(err); }
            res.redirect('/');
          })
        })
      }
    })
  }
]

exports.login_get = function (req, res, next) {
  res.render('login', { title: 'Log in' });
}

exports.join_get = function (req, res, next) {
    res.render('join', { title: 'Join the club' });
}

exports.join_post = function (req, res, next) {
  if (req.body.password == 'hunter2') {
    req.user.member = true;
    req.user.save((err) => {
      if (err) { return next(err); }
      res.redirect('/');
    })
  } else {
    res.render('join', { title: 'Join Club' });
  }
}

exports.admin_get = function (req, res, next) {
  res.render('admin', { title: 'Become an Admin' });
}

exports.admin_post = function(req, res, next) {
  if (req.body.password == 'admin') {
    req.user.admin = true;
    req.user.save((err) => {
      if (err) { return next(err); }
      res.redirect('/');
    })
  } else {
    res.render('admin', { title: 'Become an Admin' });
  }
}