const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');

let app = express();
let port = process.env.PORT || 3000; 
app.use(bodyParser.json());

// Connect to MongoDB database
mongoose.connect('mongodb://localhost/cookbook', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

// Define User schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});
const User = mongoose.model('User', userSchema);

// User registration
app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  const newUser = new User({ name, email, password });
  newUser.save((err, user) => {
      if (err) {
          res.status(400).json({ error: err.message });
      } else {
          res.status(201).json(user);
      }
  });
});

// User login
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email, password }, (err, user) => {
      if (err) {
          res.status(500).json({ error: 'Internal server error' });
      } else if (!user) {
          res.status(401).json({ error: 'Invalid email or password' });
      } else {
          res.status(200).json(user);
      }
  });
});

// Get user profile
app.get('/profile/:userId', (req, res) => {
  const userId = req.params.userId;
  User.findById(userId, (err, user) => {
      if (err) {
          res.status(500).json({ error: 'Internal server error' });
      } else if (!user) {
          res.status(404).json({ error: 'User not found' });
      } else {
          res.status(200).json(user);
      }
  });
});

// Update user profile
app.put('/profile/:userId', (req, res) => {
  const userId = req.params.userId;
  const { bio, avatar } = req.body;
  User.findByIdAndUpdate(userId, { $set: { 'profile.bio': bio, 'profile.avatar': avatar } }, { new: true }, (err, user) => {
      if (err) {
          res.status(500).json({ error: 'Internal server error' });
      } else if (!user) {
          res.status(404).json({ error: 'User not found' });
      } else {
          res.status(200).json(user);
      }
  });
});

app.listen(port, () => {
    console.log("server started");
  });