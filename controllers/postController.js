const User = require('../models/user');
const Post = require('../models/post');

const { body, validationResult } = require('express-validator');

exports.index = function(req, res, next) {
  Post.find().populate('author').exec((err, posts_list) => {
    if (err) { return next(err); }
    res.render('index', { title: 'Members Only', posts: posts_list});
  })
};

exports.post_create_get = function (req, res, next) {
  res.render('post_create', { title: 'New Post' });
};

exports.post_create_post = [
  body('title').not().isEmpty().escape(),
  body('body').not().isEmpty().escape(),

  function (req, res, next) {
    const errors = validationResult(req);

    let post = new Post({
      title: req.body.title,
      body: req.body.body,
      author: req.user,
      posted: Date.now()
    })

    if (!errors.isEmpty()) {
      res.render('post_create', { title: 'New Post', errors: errors.array() });
    } else {
      post.save((err) => {
        if (err) { return next(err); }
        res.redirect('/');
      })
    }
  }
];

exports.post_delete_post = function (req, res, next) {
  if(req.user.admin) {
    Post.findByIdAndDelete(req.params.id, (err) => {
      if (err) { return next(err); }
    })
  }
  res.redirect('/');
};