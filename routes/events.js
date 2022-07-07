const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middlewares');
const User = require('../models/User');
const Event = require('../models/Event');


// @desc    Displays all events
// @route   GET /events
// @access  Public
router.get('/', async (req, res, next) => {
    const user = req.session.currentUser;
    try {
        const events = await Event.find({}).populate('participants');
        const sortingEventFuncion = (a,b) => {
            if(a.datetime > b.datetime){
              return -1
            } else if(a.datetime < b.datetime){
              return 1
            }
            return 0
        }
        const sortedEvents = events.sort(sortingEventFuncion);
       
        res.render('events/events', {events: sortedEvents, user})
    } catch (error) {
        next(error)
    }
});

// @desc    Displays create events form
// @route   GET /events/create
// @access  Public
router.get('/create', isLoggedIn, (req, res, next) => {
    const user = req.session.currentUser;
    res.render('events/new-event', {user});
});

// @desc    Displays edit events form only for oganiser
// @route   GET /events/create
// @access  Private, only event organiser
router.get('/edit/:eventId', isLoggedIn, async (req, res, next) => {
    const { eventId } = req.params;
    try {

      const user = req.session.currentUser;
      const event = await Event.findById(eventId).populate('organiser');
      if (user.email === event.organiser.email) {
      res.render('events/edit-event', {event, user})
      } else {
        res.redirect('/');
      }
    } catch (error) {
      next(error);
    }
  });

// @desc    Displays user details
// @route   GET /events/userDetail/:id
// @access  Private
  router.get('/userDetail/:organiserId', isLoggedIn, async (req, res, next) => {
    const { organiserId } = req.params;
    const user = req.session.currentUser;
    try {
      const organiser = await User.findById(organiserId);
      res.render('events/userDetail', {organiser, user});
    } catch (error) {
      next(error)
    }
  });

// @desc    Edits events form only for oganiser
// @route   POST /events/edit/eventId
// @access  Private, only event organiser
  router.post('/edit/:eventId', isLoggedIn, async (req, res, next) => {
    const { eventId } = req.params;
    const { location, datetime, description, language } = req.body;
    try {
      const user = req.session.currentUser;
      const event = await Event.findById(eventId).populate('organiser');
      if (user.email === event.organiser.email) {
      await Event.findByIdAndUpdate(eventId, { location, datetime, description, language });
      res.redirect(`/events/${eventId}`); 
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
        const user = req.session.currentUser;
        const event = await Event.findById(eventId).populate('organiser');
        if (user.email === event.organiser.email) {
        await Event.findByIdAndDelete(eventId);
        res.redirect('/') 
      } else {
          res.redirect(`/${eventId}`);
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
        if (Date.parse(datetime) < Date.now()) {
          const user = req.session.currentUser;
          const event = {location, maxAssistants, description, language}
          res.render('events/new-event', {error: 'Date should be greater than today', event, user});
        } else {
        await Event.create({location, datetime, maxAssistants: parseInt(maxAssistants), description, language, participants: [req.session.currentUser._id], organiser: req.session.currentUser._id});
        res.redirect('/events')
        }
    } catch (error) {
        res.render('events/new-event');
        next(error);
    }
});

// @desc    Enrolls user into an event
// @route   POST /events/:eventId/enroll
// @access  Private
router.post('/:eventId/enroll', isLoggedIn, async (req, res, next) => {
  const {eventId} = req.params;
  try {
    const user = req.session.currentUser._id;
    await Event.findByIdAndUpdate(eventId, {$push: {participants: user}});
    res.redirect(`/events/${eventId}`);    
  } catch (error) {
    next(error)
  }

});

// @desc    Displays details of event
// @route   GET /events/:id
// @access  Private
router.get('/:eventId', isLoggedIn, async (req, res, next) => {
    const {eventId} = req.params;
    try {
        const user = req.session.currentUser;
        const check = req.session.currentUser;
        const event = await Event.findById(eventId).populate('organiser participants');
        if (check.email === event.organiser.email) {
        let isEnrolled = true;
        res.render('events/event-details', {event, check, user, isEnrolled})//aqui Carlos le paso el user para que en la vista de detalle puedas poner el if user enseña el boton de editar y eliminar
        } else {
            let isEnrolled = false;
            event.participants.forEach(elem => {
              if (elem.email ===  req.session.currentUser.email) {
                isEnrolled = true;
              }
            })
            res.render('events/event-details', {event, user, isEnrolled});
        }
    } catch (error) {
        next(error)
    }
});


module.exports = router;