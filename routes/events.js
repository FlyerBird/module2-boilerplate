const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middlewares');
const User = require('../models/User');
const Event = require('../models/Event');


// @desc    Displays all events
// @route   GET /events
// @access  Public
router.get('/', async (req, res, next) => {
    try {
        const events = await Event.find({});
        res.render('events/events', {events})
    } catch (error) {
        next(error)
    }
});

// @desc    Displays create events form
// @route   GET /events/create
// @access  Public
router.get('/create', isLoggedIn, (req, res, next) => {
    res.render('events/new-event');
});


// @desc    Creates a new event
// @route   POST /events/create
// @access  Private
router.post('/create', isLoggedIn, async (req, res, next) => {
    const {location, datetime, maxAssistants, description, language } = req.body;
    try {
        await Event.create({location, datetime, maxAssistants: parseInt(maxAssistants), description, language, participants: [req.session.currentUser._id]});
        res.redirect('/events')
    } catch (error) {
        res.render('events/new-event');
        next(error);
    }

});

module.exports = router;