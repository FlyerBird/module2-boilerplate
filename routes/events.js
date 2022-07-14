const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middlewares');
const User = require('../models/User');
const Event = require('../models/Event');


// @desc    Displays all events sorted from new to old
// @route   GET /events
// @access  Public
router.get('/', async (req, res, next) => {
    const user = req.session.currentUser;
    try {
        const eventsFromDB = await Event.find({}).populate('organiser');
        const sortingEventFuncion = (a,b) => {
            if (a.datetime > b.datetime) {
              return -1
            } else if(a.datetime < b.datetime) {
              return 1
            }
            return 0
        }
        const sortedEvents = eventsFromDB.sort(sortingEventFuncion);
        let counter = 0;
        for (let i = 0; i<sortedEvents.length; i++) {
          if (Date.parse(sortedEvents[i].datetime) < Date.now()) {
            counter++;
          }
        };
        sortedEvents.forEach(elem => {
          elem.availableSpots = `${elem.maxAssistants-elem.participants.length}/${elem.maxAssistants}`;
          elem.datetime = elem.datetime.replace('T', ' at ');
        });
        let ontimeEvents = sortedEvents.slice(0, sortedEvents.length-counter);
        let expiredEvents = sortedEvents.slice(sortedEvents.length-counter, sortedEvents.length);
        res.render('events/events', {ontimeEvents, expiredEvents, user})
    } catch (error) {
        next(error)
    }
});

// @desc    Displays all events sorted from new to old and sorted by language
// @route   GET /events/search/:language
// @access  Private
router.get('/search/:language', isLoggedIn, async (req, res, next) => {
  const {language} = req.params;
  const user = req.session.currentUser;
  try {
    const eventsFromDB = await Event.find({'language': language}).populate('organiser');
    const sortingEventFuncion = (a,b) => {
      if (a.datetime > b.datetime) {
        return -1
      } else if(a.datetime < b.datetime) {
        return 1
      }
      return 0
  }
  const sortedEvents = eventsFromDB.sort(sortingEventFuncion);
  let counter = 0;
  for (let i = 0; i<sortedEvents.length; i++) {
    if (Date.parse(sortedEvents[i].datetime) < Date.now()) {
      counter++;
    }
  };
  sortedEvents.forEach(elem => {
    elem.availableSpots = `${elem.maxAssistants-elem.participants.length}/${elem.maxAssistants}`;
    elem.datetime = elem.datetime.replace('T', ' at ');
  });
  let ontimeEvents = sortedEvents.slice(0, sortedEvents.length-counter);
  let expiredEvents = sortedEvents.slice(sortedEvents.length-counter, sortedEvents.length);
  res.render('events/events', {ontimeEvents, expiredEvents, user})
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
      const events = await Event.find({'participants': organiserId});
      res.render('events/userDetail', {organiser, user, events});
    } catch (error) {
      next(error)
    }
   
  });

// @desc    Edits events form only for oganiser
// @route   POST /events/edit/eventId
// @access  Private, only event organiser
  router.post('/edit/:eventId', isLoggedIn, async (req, res, next) => {
    const { eventId } = req.params;
    const { location, datetime, description, language, maxAssistants } = req.body;
    try {
      const user = req.session.currentUser;
      const event = await Event.findById(eventId).populate('organiser');
      if (user.email === event.organiser.email && maxAssistants <= 8 && (Date.parse(datetime) > Date.now())) {
      await Event.findByIdAndUpdate(eventId, { location, datetime: datetime.toLocaleString('sp-ES'), description, language, maxAssistants: parseInt(maxAssistants) });
      res.redirect(`/events/${eventId}`); 
    } else {
      res.render('events/edit-event', {error: 'Date should be greater than today and maximus spots are 8', event, user});
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
    const user = req.session.currentUser;
    if (!location || !datetime || !maxAssistants || !description || !language) {
      res.render('events/new-event'), {error: 'All fields are mandatory', user }
    }
    try {
        if (Date.parse(datetime) < Date.now() || maxAssistants > 8) {
          const user = req.session.currentUser;
          const event = {location, maxAssistants, description, language}
          res.render('events/new-event', {error: 'Date should be greater than today and max spots are 8', event, user});
        } else {
        await Event.create({location, datetime: datetime.toLocaleString('sp-ES'), maxAssistants: parseInt(maxAssistants), description, language, participants: [req.session.currentUser._id], organiser: req.session.currentUser._id});
        res.redirect('/events')
        }
    } catch (error) {
        console.log(error);
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

// @desc    Removes user from an event
// @route   POST /events/:eventId/unroll
// @access  Private
router.post('/:eventId/unroll', isLoggedIn, async (req, res, next) => {
  const {eventId} = req.params;
  try {
    const user = req.session.currentUser._id;
    await Event.findByIdAndUpdate(eventId, {$pull: {participants: user}});
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
        event.datetime = event.datetime.replace('T', ' at ');
        if (check.email === event.organiser.email) {
        let isEnrolled = true;
        res.render('events/event-details', {event, check, user, isEnrolled})
        } else {
            let isEnrolled = false;
            if (event.maxAssistants === event.participants.length) {
              isEnrolled = true;
            }
            event.participants.forEach(elem => {
              if (elem.email === req.session.currentUser.email) {
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