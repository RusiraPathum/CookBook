const Recipe = require("../models/recipeModel.js");

// Create recipe method
const createRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.createRecipe(req.body);
    res.status(200).json({ recipe });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

//Get all recipes method
const getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.getAllRecipes();
    res.status(200).json({ recipes });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

//Get singale recipe method
const getRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await Recipe.getRecipeById(id);
    if (!recipe) {
      res.status(404);
      throw new Error(`cannot find any product with ID ${id}`);
    }
    res.status(200).json({ recipe });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

//Update recipe method
const updateRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedRecipe = await Recipe.updateRecipeById(id, req.body);
    if (!updatedRecipe) {
      res.status(404);
      throw new Error(`cannot find any product with ID ${id}`);
    }
    res.status(200).json(updatedRecipe);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

//Delete recipe method
const deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRecipe = await Recipe.deleteRecipeById(id);

    if (!deletedRecipe) {
      res.status(404);
      throw new Error(`cannot find any product with ID ${id}`);
    }

    res.status(200).json(deletedRecipe);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createRecipe,
  getAllRecipes,
  getRecipe,
  updateRecipe,
  deleteRecipe,
};
