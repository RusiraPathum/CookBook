let express = require('express');
let router = express.Router();
let recipeController = require('../controllers/recipeController');

// Route to get the count of active recipes
router.get('/active-count', recipeController.getActiveRecipeCount);

// Route to get the count of inactive recipes
router.get('/inactive-count', recipeController.getInactiveRecipeCount);

//Create recipe route
router.post('/create', recipeController.createRecipe);

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

router.put('/update-status/:id', recipeController.updateRecipeStatus);

// Route to fetch recipe status data
router.get('/chart-status', recipeController.getRecipeStatusData);


// router.get('/recent', recipeController.getMostRecentRecipe);


module.exports = router;
