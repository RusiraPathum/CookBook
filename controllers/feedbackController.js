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

module.exports = {
    createFeedback,
};