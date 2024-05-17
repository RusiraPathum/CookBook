const Recipe = require("../models/recipeModel.js");
const path = require("path");

// Create recipe method
const createRecipe = async (req, res) => {
  try {
    const { title, description, ingredients, instructions } = req.body;
    const imageUrl = req.file ? path.join('/uploads', req.file.filename) : null;

    if (!imageUrl) {
      return res.status(400).json({ message: "Please add an image" });
    }

    const recipeData = {
      title,
      description,
      ingredients,
      instructions,
      imageUrl,
    };

    const recipe = await Recipe.createRecipe(recipeData);
    res.status(200).json({ recipe });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

// Get all recipes method
const getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.getAllRecipes();
    res.status(200).json({ recipes });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

// Get single recipe method
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

// Update recipe method
const updateRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    if (req.file) {
      updatedData.imageUrl = path.join('/uploads', req.file.filename);
    }
    const updatedRecipe = await Recipe.updateRecipeById(id, updatedData);
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

// Delete recipe method
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

// controllers/recipeController.js


// Update recipe status method
const updateRecipeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await Recipe.getRecipeById(id);

    if (!recipe) {
      res.status(404);
      throw new Error(`Cannot find any recipe with ID ${id}`);
    }

    // Toggle the status
    const newStatus = !recipe.status;

    // Update the status in the database
    const updatedRecipe = await Recipe.updateRecipeStatusById(id, newStatus);

    res.status(200).json(updatedRecipe);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

// Controller method to get the count of active recipes
const getActiveRecipeCount = async (req, res, next) => {
  try {
      const activeRecipeCount = await Recipe.countActiveRecipes();
      res.json({ activeRecipeCount });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  createRecipe,
  getAllRecipes,
  getRecipe,
  updateRecipe,
  deleteRecipe,
  getActiveRecipeCount,
  updateRecipeStatus,
};
