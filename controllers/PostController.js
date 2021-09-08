const mongoose = require('mongoose');
const Post = require('../models/Posts');
const User = require('../models/Users');

exports.getAllPosts = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.username });
    const posts = await Post.find({ author: user._id });
    res.json(posts);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.getPost = (req, res) => {
  Post.findById({ _id: req.params.postId })
    .populate('author', 'name')
    .exec((err, post) => {
      if (err) res.status(404).send(err);
      res.json(post);
    });
};

exports.addPost = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.username });
    const post = new Post({ title: req.body.title, author: user._id });
    await post.save();
    // req.user._id = user._id
    next();
  } catch (err) {
    res.status(500).send(err);
  }
};
