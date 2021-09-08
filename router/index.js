const router = require('express').Router();
const postController = require('../controllers/PostController');
const usersController = require('../controllers/UserController');

router.get(
  '/posts',
  usersController.authenticateUser,
  postController.getAllPosts
);
router.post(
  '/posts',
  usersController.authenticateUser,
  postController.addPost,
  postController.getAllPosts
);
router.get('/posts/:postId', postController.getPost);

// router.post('/users/signup', usersController.addUser);
// router.post('/users/login', usersController.loginUser);
// router.delete('/users/logout', usersController.logout);
// router.get('/users', usersController.getAllUsers);

// router.post('/token', usersController.refreshToken);

module.exports = router;
