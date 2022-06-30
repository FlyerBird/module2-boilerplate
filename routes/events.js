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

// @desc    Displays edit events form only for oganiser
// @route   GET /events/create
// @access  Private, only event organiser
router.get('/edit/:eventId', isLoggedIn, async (req, res, next) => {
    const { eventId } = req.params;
    try {
      const user = req.session.currentUser._id;
      console.log('djksfsdkjfn');
      const event = await Event.findById(eventId);
      console.log(event)
      //if (user === event.organiser) {
      res.render('events/edit-event', event)
      // } else {
        //res.redirect('/');
      //}
    } catch (error) {
      next(error);
    }
  });

// @desc    Edits events form only for oganiser
// @route   POST /events/edit/eventId
// @access  Private, only event organiser
  router.post('/edit/:eventId', isLoggedIn, async (req, res, next) => {
    const { eventId } = req.params;
    const { location, datetime, maxAssistants, description, language } = req.body;
    try {
      const user = req.session.currentUser._id;
      const event = await Event.findById(eventId);
      if (user === event.organiser) {
      await Event.findByIdAndUpdate(eventId, { location, datetime, maxAssistants: parseInt(maxAssistants), description, language });
      res.redirect(`/${eventId}`) 
    } else {
        res.redirect('/');
      }
    } catch (error) {
      next(error);
    }
  })
  
// @desc    Deletes event only for oganiser
// @route   POST /events/delete/eventId
// @access  Private, only event organiser
  router.post('/delete/:eventId', isLoggedIn, async (req, res, next) => {
    const { eventId } = req.params;
    try {
        const user = req.session.currentUser._id;
        const event = await Event.findById(eventId);
        if (user === event.organiser) {
        await Event.findByIdAndDelete(eventId);
        res.redirect('/') 
      } else {
          res.redirect('/');
        }
    } catch (error) {
      next(error);
    }
  });

// @desc    Creates a new event
// @route   POST /events/create
// @access  Private
router.post('/create', isLoggedIn, async (req, res, next) => {
    const {location, datetime, maxAssistants, description, language } = req.body;
    try {
        await Event.create({location, datetime, maxAssistants: parseInt(maxAssistants), description, language, participants: [req.session.currentUser._id], organiser: req.session.currentUser._id});
        res.redirect('/events')
    } catch (error) {
        res.render('events/new-event');
        next(error);
    }

});

// @desc    Displays details of event
// @route   GET /events/:id
// @access  Private
router.get('/:eventId', isLoggedIn, async (req, res, next) => {
    const {eventId} = req.params;
    const user = req.session.currentUser._id;
    try {
        const event = await Event.findById(eventId).populate('participants', 'organiser')
        if (user === event.organiser) {
        res.render('events/event-details', {event, user})//aqui Carlos le paso el user para que en la vista de detalle puedas poner el if user enseña el boton de editar y eliminar
        } else {
            res.render('events/event-details', {event})
        }
    } catch (error) {
        next(error)
    }
});


module.exports = router;