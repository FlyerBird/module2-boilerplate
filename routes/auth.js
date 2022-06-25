const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middlewares');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// @desc    Displays form view to sign up
// @route   GET /auth/signup
// @access  Public
router.get('/signup', async (req, res, next) => {
  res.render('auth/signup');
})

// @desc    Displays form view to log in
// @route   GET /auth/login
// @access  Public
router.get('/login', async (req, res, next) => {
  res.render('auth/login');
})

// @desc    Sends user auth data to database to create a new user
// @route   POST /auth/signup
// @access  Public
router.post('/signup', async (req, res, next) => {
  const { email, password, username, dateOfBirth, languageSkills } = req.body;
  // ⚠️ Add validations!
  if (!email || !password || !username || !dateOfBirth || !languageSkills) {
    res.render('auth/signup', { error: 'All fields are mandatory. Please fill them before submitting.' })
    return;
  }
  const regexPassword = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regexPassword.test(password)) {
      res.render('auth/signup', { error: 'Password must have lowercase letters, uppercase letters and at least one number.' })
      return;
  }
  try {
    const userCheck = await User.findOne({ username: username });
    const emailCheck = await User.findOne({email: email});
    if (userCheck) {
      res.render('auth/signup', { error: "Usename already exists, try with another one" });
      return;
    } else if (emailCheck) {
      res.render('auth/login', { error: "Email is registered. Please log in" });
      return;
    } else {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({ username, email, hashedPassword, dateOfBirth, languageSkills });
    res.render('auth/profile', user)
    }
  } catch (error) {
    next(error)
  }
});

// @desc    Sends user auth data to database to authenticate user
// @route   POST /auth/login
// @access  Public
router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;
  // ⚠️ Add more validations!
  if (!email || !password) {
    res.render('auth/login', { error: 'All fields are mandatory. Please fill them before submitting.' })
    return;
  }
  try {
    // Remember to assign user to session cookie:
    const user = await User.findOne({ email: email });
    if (!user) {
      res.render('auth/login', { error: "User not found" });
      return;
    } else {
      const match = await bcrypt.compare(password, user.hashedPassword);
      if (match) {
        req.session.currentUser = user;
        res.redirect('/');
      } else {
        res.render('auth/login', { error: "Unable to authenticate user" });
      }
    }
  } catch (error) {
    next(error);
  }
})

// @desc    Destroy user session and log out
// @route   POST /auth/logout
// @access  Private
router.post('/logout', isLoggedIn, (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      next(err)
    } else {
      res.redirect('/auth/login');
    }
  });
})

module.exports = router;
