let express = require('express');
let router = express.Router();
let controller = require('../controllers/recipeController');

router.post('/add', function (req, res) {
    controller.postRecipe(req, res);
});