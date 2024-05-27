const mongoose = require("mongoose");

// Define the schema for the Feedback model
const feedbackSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comment: String,
    recipeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipe",
    },
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
    console.log(feedbackData);
    return await Feedback.create(feedbackData);
  } catch (error) {
    throw new Error(error.message);
  }
};

// Logic for deleting a feedback by ID
Feedback.deleteFeedbackById = async (id) => {
  try {
    return await Feedback.findByIdAndDelete(id);
  } catch (error) {
    throw new Error(error.message);
  }
};

// Logic for fetching all feedbacks
Feedback.getAllFeedbacks = async () => {
  try {
    return await Feedback.find({});
  } catch (error) {
    throw new Error(error.message);
  }
};

// Logic for fetching feedbacks by recipe ID
Feedback.getFeedbacksByRecipeId = async (recipeId) => {
  try {
    return await Feedback.find({ recipeId }).populate('userId', 'name'); // Populate user information
  } catch (error) {
    throw new Error(error.message);
  }
};


module.exports = Feedback;
