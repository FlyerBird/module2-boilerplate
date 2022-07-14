const { Schema, model } = require('mongoose');
 
const eventSchema = new Schema(
  {
    location: {
        type: String,
        required: [true, 'Event location is required.'],
    },
    datetime: {
        type: String,
        required: [true, 'Date is required'],
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
        type: String, 
        required: [true, 'This field is required.']
    },
    participants: {
        type: [Schema.Types.ObjectId],
        ref: 'User',
    },
    organiser: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    availableSpots: {
        type: String,
    },
    link: {
        type: String,
    }
  },
  {
    timestamps: true
  }
);
 
const Event = model('Event', eventSchema);

module.exports = Event;