const Feedback = require("../models/feedbackModel.js");

// Create feedback method
const createFeedback = async (req, res) => {
  try {
    const { comment } = req.body;
    const userId = req.user.userId; 

    if (!userId || !comment) {
      return res
        .status(400)
        .json({ message: "User ID and comment are required." });
    }

    const newFeedback = new Feedback({
      userId: userId,
      comment: comment,
    });

    const savedFeedback = await newFeedback.save(); // Save the feedback
    res.status(200).json({ feedback: savedFeedback });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

// Delete feedbackmethod
const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedFeedback = await Feedback.deleteFeedbackById(id);

    if (!deletedFeedback) {
      res.status(404);
      throw new Error(`cannot find any feedback with ID ${id}`);
    }

    res.status(200).json(deleteFeedback);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

// Get all Feedbacks method
const getAllFeedbacks = async (req, res) => {
  try {
    const Feedbacks = await Feedback.getAllFeedbacks();
    res.status(200).json({ Feedbacks });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createFeedback,
  deleteFeedback,
  getAllFeedbacks,
};
