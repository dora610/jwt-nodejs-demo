const bcrypt = require('bcrypt');
const User = require('../models/Users');
const jwt = require('jsonwebtoken');

const saltRounds = 10;
let refreshTokens = [];

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'username -_id');
    res.json(users);
  } catch (err) {
    res.status(500).send(err);
  }
};

const generateAccessToken = (payload) =>
  jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 60 * 10 });
const generateRefreshToken = (payload) =>
  jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET);

exports.addUser = async (req, res) => {
  try {
    const hash = await bcrypt.hash(req.body.password, saltRounds);
    const user = new User({ username: req.body.username, hash });
    await user.save();
    const accessToken = generateAccessToken({ username: user.username });
    res.json({
      message: `Successfully created user with username: ${user.username}`,
      token: accessToken,
    });
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.loginUser = async (req, res) => {
  try {
    // Authenticate user
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      res.status(404).send('User not found');
      return;
    }
    const isUser = await bcrypt.compare(req.body.password, user.hash);
    if (!isUser) {
      res.status(401).send('Incorrect password');
      return;
    }
    // create jwt
    const accessToken = generateAccessToken({ username: user.username });
    const refreshToken = generateRefreshToken({ username: user.username });
    res.json({
      message: 'Successfully logged in',
      token: accessToken,
      refresh: refreshToken,
    });
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.authenticateUser = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).send('missing token');
      return;
    }
    const token = authHeader.split(' ')[1];
    const { username } = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.username = username;
    next();
  } catch (err) {
    res.status(403).send('You are not authorized');
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const refreshToken = req.body.token;
    if (refreshToken == null) {
      res.status(401).send('No token found');
      return;
    }
    if (!refreshTokens.includes(refreshToken)) {
      res.status(403).send('No token found');
      return;
    }
    const { username } = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const accessToken = generateAccessToken({ username });
    res.json({ token: accessToken });
  } catch (err) {
    res.status(403).send('No token found');
  }
};

exports.logout = (req, res) => {
  refreshTokens = refreshTokens.filter((tkn) => tkn !== req.body.token);
  res.status(204).send('Logged out');
};
