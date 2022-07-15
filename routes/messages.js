const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middlewares');
const User = require('../models/User');
const Event = require('../models/Event');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const fileUploader = require('../config/cloudinary.config');


router.get('/', (req, res, next) => {
    const user = req.session.currentUser;
    res.render('messages/messages', {user});
  })

  
router.get('/write', (req, res, next) => {
    const user = req.session.currentUser;
    const userOrganiser = req.params
    res.render('messages/messagesWrite', {user});
  })



router.post('/write', isLoggedIn, async (req, res, next) => {
    const message = req.body; 
    try {
        const user = await User.findByIdAndUpdate(id, {$push: message})
        
    } catch (error) {
        next(error)
    }

   
})











module.exports = router;