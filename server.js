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