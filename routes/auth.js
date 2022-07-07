const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middlewares');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const fileUploader = require('../config/cloudinary.config');

// @desc    Displays form view to sign up
// @route   GET /auth/signup
// @access  Public
router.get('/signup', (req, res, next) => {
  const user = req.session.currentUser;
  res.render('auth/signup', {user});
})

// @desc    Displays form view to log in
// @route   GET /auth/login
// @access  Public
router.get('/login', (req, res, next) => {
  const user = req.session.currentUser;
  res.render('auth/login', {user});
})

// @desc    Displays user profile view
// @route   GET /auth/private
// @access  Private
router.get('/profile', isLoggedIn, (req, res, next) => {
  const user = req.session.currentUser;
  res.render('auth/profile', {user});
})

// @desc    Edit user profile view
// @route   GET /auth/private
// @access  Private
router.get('/profile/edit', isLoggedIn, (req, res, next) => {
  const user = req.session.currentUser;
  res.render('auth/editProfile', {user});
})

// @desc    Sends user auth data to database to create a new user
// @route   POST /auth/signup
// @access  Public
router.post('/signup', fileUploader.single('imageProfile'), async (req, res, next) => {
  const { email, password, confirmPassword, fullname, username, dateOfBirth, languageSkills, imageProfile } = req.body;
  // ⚠️ Add validations!
  if (!email || !password || !confirmPassword || !username || !dateOfBirth || !languageSkills || !fullname) {
    res.render('auth/signup', { error: 'All fields are mandatory. Please fill them before submitting.' })
    return;
  }
  const regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
  if (!regexPassword.test(password)) {
      res.render('auth/signup', { error: 'Password must have between 8 and 15 characters, at least one lowercase letter, one uppercase letter, one number and one special character' })
      return;
  }
  if (password !== confirmPassword) {
    res.render('auth/signup', { error: 'Password do not match ' })
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
    const user = await User.create({ username, email, fullname, hashedPassword, dateOfBirth, languageSkills, imageUrl: req.file.path });
    res.render('auth/login', user)
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
    const user = await User.findOne({ email: email });
    if (!user) {
      res.render('auth/login', { error: "User not found" });
      return;
    } else {
      const match = await bcrypt.compare(password, user.hashedPassword);
      if (match) {
        req.session.currentUser = user;
        res.render('auth/profile', {user});
      } else {
        res.render('auth/login', { error: "Unable to authenticate user" });
      }
    }
  } catch (error) {
    next(error);
  }
})

// @desc    Edit user profile
// @route   POST /auth/profile/edit
// @access  Private
router.post('/profile/edit', isLoggedIn, fileUploader.single('imageProfile'), async (req,res,next) => {
  const id = req.session.currentUser._id
  const { email, fullname, username, dateOfBirth, languageSkills, imageProfile } = req.body;
  try {
      const user = await User.findByIdAndUpdate(id, {email, fullname, username, dateOfBirth, languageSkills, imageUrl: req.file.path}, {new:true});
      if(user) {
        req.session.currentUser = user;
        res.render('auth/editProfile', {user})
      }
  } catch (error) {
      next(error)
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
