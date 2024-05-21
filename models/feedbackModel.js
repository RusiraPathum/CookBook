const mongoose = require("mongoose");

// Define the schema for the Feedback model
const feedbackSchema = mongoose.Schema(
    {
      email: String,
      comment: String,
    },
    {
      timestamps: true,
    }
  );

  // Create the Feedback model
const Feedback = mongoose.model("Feedback", feedbackSchema);

// Logic for creating a feedback
Feedback.createFeedback = async (feedbackData) => {
    try {
      // console.log(feedbackData);
      return await Feedback.create(feedbackData);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  
module.exports = Feedback;