require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const recipeRoute = require('./routes/recipeRoute');
const feedbackRoute = require('./routes/feedbackRoute');  
const authRoute = require('./routes/authRoute');
const userRoute = require('./routes/userRoute');


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

// Authentication and User routes
app.use('/api/auth', upload.single('image'), authRoute); 
app.use('/api/user',upload.single('image'), userRoute); 

let MONGO_URL = process.env.MONGO_URL; 
let PORT = process.env.PORT || 3000; 
let JWT_SECRET = process.env.JWT_SECRET;

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