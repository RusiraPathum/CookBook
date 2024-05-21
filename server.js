require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const recipeRoute = require('./routes/recipeRoute');
const feedbackRoute = require('./routes/feedbackRoute'); // Ensure the path is correct

const app = express();

// Middleware to serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Use cors middleware
app.use(cors());

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Recipe route
app.use('/api/recipe', upload.single('image'), recipeRoute);

// Feedback route
app.use('/api/feedback', feedbackRoute);

let MONGO_URL = process.env.MONGO_URL; 
let PORT = process.env.PORT || 3000; 

mongoose.set("strictQuery", false);
mongoose.connect(MONGO_URL)
    .then(() => {
        console.log('connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Node API app is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.log(error);
    });

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