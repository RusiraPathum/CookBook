let express = require('express');
let router = express.Router();
let feedbackController = require('../controllers/feedbackController');
const authMiddleware = require('../middleware/authMiddleware');

//Create feedback route
router.post('/create', authMiddleware, feedbackController.createFeedback);

//Delete feedback route
router.delete('/delete/:id', function (req, res) {
    feedbackController.deleteFeedback(req, res);
});

//Get all feedback route
router.get('/', function (req, res) {
    feedbackController.getAllFeedbacks(req, res);
});

router.get('/:id', function (req, res) {
    feedbackController.getFeedbacksByRecipeId(req, res);
  });
  

module.exports = router;