# iTalk
## Description
​
This is a project developed by Cristian Alarcon and Carlos Nieto as the project for the second module at Ironhack. 
 
It is a Mobile First application which brings the opportunity to join and publish different events in different locations.
 
The only thing you have to do is create a user profile which would include the skills that you already have and would like to share with the community (at this point of the project we are going to focus on language skills).
 
Once you have a profile on "iTalk", you will be able to add a post offering what languages you have knowledge of, where (presentially or online?¿) you would like to create an event, when the meeting is and how many people you would like to put together. At the same time, you will have access to all the posts the rest of the people made and join them if there are available spots.

It is free for individuals, collaborative, useful to improve your language skills and it is fun!
 

---
​
## Instructions
​
When cloning the project, change the <code>sample.env</code> for an <code>.env</code> with the values you consider:
```js
PORT=3000
MONGO_URL='mongodb://localhost/dbName'
SESSION_SECRET='SecretOfYourOwnChoosing'
NODE_ENV='development'
```
Then, run:
```bash
npm install
```
To start the project run:
```bash
npm run start
```

---
​
## User stories (MVP)
​
What can the user do with the app?
- User can SIGN UP and CREATE and account
- User can LOGIN
- User can LOGOUT
- User can POST events
- User can JOIN events
- User can FILTER events by language
- User can DISJOIN events
- User can EDIT or DELETE his events
- User can EDIT or DELETE his account
---
​
​
## Models
​
### USER:
​
Users in the database have the following properties:
```js
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
    livingCity: {
      type: String,
      required: [true, 'Living city is required']
    },
    dateOfBirth: {
      type: Date,
      required: [true, 'Date of birth is required.']
    },
    languageSkills: {
      type: [String],
      required: [true, 'This field is required.']
    },
    imageProfile: String
  },
  {
    timestamps: true
  }
);
```

### EVENT:
​
Events in the database have the following properties:
```js

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
```
Post Event:
 
Review:
​
---
​
## Routes
​
| Name  | Method | Endpoint    | Protected | Req.body            | Redirects |
|-------|--------|-------------|------|---------------------|-----------|
| Home  | GET   | /           | No   |                     |           |
| Login | GET    | /auth/login | No |                      |           |
| Login | POST | /auth/login   | No | { email, password }  | /         |
| Signup | GET    | /auth/signup | No |                      |           |
| Signup | POST | /auth/signup   | No | { username, email, password }  | /auth/login  |
| New movie  | GET    | /movies/new | Yes |                      |           |
| New movie | POST | /movies/new   | Yes | { title, cast, genre }  | /movies/:movieId   |
​
---
​
## Useful links
​
- [Github Repo](https://github.com/alebausa/module2-boilerplate)
- [Deployed version](https://italkapp.herokuapp.com/)
