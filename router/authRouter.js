const router = require('express').Router();
const usersController = require('../controllers/UserController');

router.post('/signup', usersController.addUser);
router.post('/login', usersController.loginUser);
router.delete('/logout', usersController.logout);
router.get('/', usersController.getAllUsers);

router.post('/token', usersController.refreshToken);

module.exports = router;
