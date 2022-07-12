require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('../models/Event');
const User = require('../models/User');

// Add the model and array you want to seed
const events = [
  {
    location: "Barcelona",
    datetime: "2022-07-11T22:05",
    maxAssistants: 4,
    description: "English talk @Caféblenou",
    language: "English",
    organiser: '62bb4c2e6612c6581f62a6e0',
    availableSpots: "7"
  }
]

mongoose.connect(process.env.MONGO_URL)
  .then(x => console.log(`Connected to ${x.connection.name}`))
  .then(() => {
    return Event.create(events)// Code to create elements in the DB
  })
  .then((res) => {
    console.log('Seed done 🌱', res);
  })
  .catch(e => console.log(e))
  .finally(() => {
    console.log('Closing connection');
    mongoose.connection.close();
  })