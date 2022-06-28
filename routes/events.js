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
        res.render('events/event', {events})
    } catch (error) {
        next(error)
    }
});

router.get('/create', (req, res, next) => {
    try {
        res.render('events/new-event')
    } catch (error) {
        next(error)
    }
});


// @desc    Creates a new event
// @route   POST /events/create
// @access  Private
router.post('/create', isLoggedIn, async (req, res, next) => {
    const {location, date, time, maxAssistants, description, language } = req.body;
    try {
        await Event.create({location, date, time: parseInt(time), maxAssistants: parseInt(maxAssistants), description, language});
        res.redirect('/events')
        console.log("hola")
    } catch (error) {
        res.render('events/new-event');
        next(error);
    }

});

module.exports = router;