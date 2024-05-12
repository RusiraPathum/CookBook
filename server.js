const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');

let app = express();
let port = process.env.PORT || 3000; 
app.use(bodyParser.json());

// Connect to MongoDB database
mongoose.connect('mongodb://localhost/cookbook', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

// Define Feedback schema
const feedbackSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipeId: { type: mongoose.Schema.Types.ObjectId, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: String,
  createdAt: { type: Date, default: Date.now }
});
const Feedback = mongoose.model('Feedback', feedbackSchema);


// Get user feedback
app.get('/feedback/:recipeId', (req, res) => {
  const recipeId = req.params.recipeId;
  Feedback.find({ recipeId }, (err, feedback) => {
      if (err) {
          res.status(500).json({ error: 'Internal server error' });
      } else if (!feedback) {
          res.status(404).json({ error: 'Feedback not found for this recipe' });
      } else {
          res.status(200).json(feedback);
      }
  });
});

// Post user feedback
app.post('/feedback', (req, res) => {
  const { userId, recipeId, rating, comment } = req.body;
  const newFeedback = new Feedback({ userId, recipeId, rating, comment });
  newFeedback.save((err, feedback) => {
      if (err) {
          res.status(400).json({ error: err.message });
      } else {
          res.status(201).json(feedback);
      }
  });
});

app.listen(port, () => {
    console.log("server started");
});
