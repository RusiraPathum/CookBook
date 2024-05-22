let express = require('express');
let router = express.Router();
let feedbackController = require('../controllers/feedbackController');

//Create feedback route
router.post('/create', feedbackController.createFeedback);

module.exports = router;