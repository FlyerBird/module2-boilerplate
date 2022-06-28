const { Schema, model } = require('mongoose');
 
const eventSchema = new Schema(
  {
    location: {
        type: String,
        required: [true, 'Event location is required.'],
        default: Date.now
    },
    datetime: {
        type: Date,
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