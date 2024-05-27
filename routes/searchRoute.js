const express = require('express');
const router = express.Router();
const { searchRecipes } = require('../controllers/recipeController');

// Search recipes route
router.get('/recipe', searchRecipes);

module.exports = router;
