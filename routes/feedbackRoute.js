let express = require('express');
let router = express.Router();
let feedbackController = require('../controllers/feedbackController');

//Create feedback route
router.post('/create', feedbackController.createFeedback);

//Delete feedback route
router.delete('/delete/:id', function (req, res) {
    feedbackController.deleteFeedback(req, res);
});

module.exports = router;