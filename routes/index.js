var express = require('express');
var router = express.Router();
var passport = require('passport');

const userController = require('../controllers/userController');
const postController = require('../controllers/postController');

router.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

router.get('/signup', userController.sign_up_get);
router.post('/signup', userController.sign_up_post);
router.get('/login', userController.login_get);
router.post('/login', passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login"
}));
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});
router.get('/join', loggedIn, userController.join_get);
router.post('/join', loggedIn, userController.join_post);

router.get('/admin', loggedIn, isMember, userController.admin_get);
router.post('/admin', loggedIn, isMember, userController.admin_post);

router.get('/new-post', loggedIn, postController.post_create_get);
router.post('/new-post', loggedIn, postController.post_create_post);

router.post('/post/:id/delete', postController.post_delete_post);

/* GET home page. */
router.get('/', postController.index);

module.exports = router;

function loggedIn(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.redirect('/login');
  }
}

function isMember(req, res, next) {
  if (req.user.member) {
    next();
  } else {
    res.redirect('/join');
  }
}