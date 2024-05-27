let express = require('express');
let router = express.Router();
let mealPlanController = require('../controllers/mealPlanController');
let recipeController = require('../controllers/recipeController');
const authMiddleware = require('../middleware/authMiddleware');

// Create meal plan route
router.post('/create', authMiddleware, mealPlanController.createMealPlan);

// Get all meal plans route
router.get('/', function (req, res) {
    mealPlanController.getAllMealPlans(req, res);
});

// Get a single meal plan route
router.get('/:id', function (req, res) {
    mealPlanController.getMealPlan(req, res);
});

// Update meal plan route
router.put('/update/:id', function (req, res) {
    mealPlanController.updateMealPlan(req, res);
});

// Delete meal plan route
router.delete('/delete/:id', mealPlanController.deleteMealPlan);

// Route to fetch recipes for select input
// router.get('/select', mealPlanController.getRecipesForSelect);

router.get('/select', function (req, res) {

    console.log('dasdsadasdsa');
    mealPlanController.getRecipesForSelect;
});


module.exports = router;
