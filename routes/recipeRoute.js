let express = require('express');
let router = express.Router();
let recipeController = require('../controllers/recipeController');

//Create recipe route
router.post('/create', function (req, res) {
    recipeController.createRecipe(req, res);
});

//Get all recipes route
router.get('/', function (req, res) {
    recipeController.getAllRecipes(req, res);
});

//Get a single recipe route
router.get('/:id', function (req, res) {
    recipeController.getRecipe(req, res);
});

//Update recipe route
router.put('/update/:id', function (req, res) {
    recipeController.updateRecipe(req, res);
});

//Delete recipe route
router.delete('/delete/:id', function (req, res) {
    recipeController.deleteRecipe(req, res);
});

module.exports = router;