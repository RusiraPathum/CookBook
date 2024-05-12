let express = require('express');
let router = express.Router();
let controller = require('../controllers/recipeController');

router.post('/create', function (req, res) {
    controller.createRecipe(req, res);
});

module.exports = router;