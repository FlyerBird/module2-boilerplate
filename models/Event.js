const { Schema, model } = require('mongoose');
 
const eventSchema = new Schema(
  {
    location: {
        type: String,
        required: [true, 'Event location is required.'],
        default: Date.now
    },
    date: {
        type: Date,
        required: [true, 'Date is required'],
    }, 
    time: {
        type: Number,
        required: [true, 'Time range is 08:00-22:00'],
        min: 8,
        max: 22,
    },
    maxAssistants: {
        type: Number,
        min: 2,
        max: 8,
        default: 2,
    },
    description: {
        type: String,
        required: [true, 'Description is required.']
    },
    language: {
        type: String, //en este caso solo una lengua
        required: [true, 'This field is required.']
    },
    participants: {
        type: [Schema.Types.ObjectId],
        ref: 'User',
    },
  },
  {
    timestamps: true
  }
);
 
const Event = model('Event', eventSchema);

module.exports = Event;