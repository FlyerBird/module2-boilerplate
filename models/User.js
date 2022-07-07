const { Schema, model } = require('mongoose');
 
const userSchema = new Schema(
  // Add whichever fields you need for your app
  {
    username: {
      type: String,
      trim: true,
      required: [true, 'Username is required.'],
      unique: true
    },
    fullname: {
      type: String,
      required: [true, 'Your full name is required.'],
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      lowercase: true,
      trim: true
    },
    hashedPassword: {
      type: String,
      required: [true, 'Password is required.']
    },
    dateOfBirth: {
      type: Date,
      required: [true, 'Date of birth is required.']
    },
    languageSkills: {
      type: [String],
      required: [true, 'This field is required.']
    },
    imageUrl: String
  },
  {
    timestamps: true
  }
);
 
const User = model('User', userSchema);

module.exports = User;