const Feedback = require("../models/feedbackModel.js");

// Create feedback method
const createFeedback = async (req, res) => {
    try {
        const { email, comment, } = req.body;

        const feedbackData = {
            email,
            comment,
        };

        const feedback = await Feedback.createFeedback(feedbackData);
        res.status(200).json({ feedback });
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

module.exports = {
    createFeedback,
    deleteFeedback,
};