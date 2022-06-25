# iTalk
​
## Description
​
This is a project developed by Cristian Alarcon and Carlos Nieto as the project for the second module at Ironhack. 
 
The application brings the opportunity to join and publish different events in different locations.
 
The only thing you have to do is create a user profile which would include the skills that you already have and would like to share with the community (at this point of the project we are going to focus on language skills).
 
Once you have a profile on "iTalk", you will be able to add a post offering what languages you have knowledge of, where (presentially or online?¿) you would like to create an event, when the meeting is and how many people you would like to put together. At the same time, you will have access to all the posts the rest of the people made and join them if there are available spots.
 
​1. IT’S FREE FOR INDIVIDUALS
2. COLLABORATIVE
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
​
---
​
## User stories (MVP)
​
What can the user do with the app?
- User can sign up and create and account
- User can login
- User can log out
- User can post events
- User can join events
- User can send reviews
- User can receive reviews
 
​
## User stories (Backlog)
​
- User can upload a profile picture
- User can ...
​
---
​
## Models
​
User:
​
```js
const userSchema = new Schema(
 {
   username: {
     type: String,
     trim: true,
     required: [true, 'Username is required.'],
     unique: true
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
     type: String,
     required: [true, dateOfBirth is required.']
   },
	languageSkills: {
	  type: [String],
	  required: [true, ‘this fiels is required.’]
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
- [Deployed version]()
- [Presentation slides](https://www.slides.com)
