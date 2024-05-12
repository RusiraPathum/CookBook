const mongoose = require("mongoose");

// Define the schema for the Recipe model
const recipeSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please enter a recipe name"],
    },
    description: String,
    ingredients: {
      type: String,
      required: [true, "Please enter ingredients"],
    },
    instructions: {
      type: String,
      required: [true, "Please enter instructions"],
    },
    imageUrl: {
      type: String,
      required: [true, "Please add an image"],
    },
  },
  {
    timestamps: true,
  }
);

// Create the Recipe model
const Recipe = mongoose.model("Recipe", recipeSchema);

// Logic for creating a recipe
Recipe.createRecipe = async (recipeData) => {
  try {
    return await Recipe.create(recipeData);
  } catch (error) {
    throw new Error(error.message);
  }
};

// Logic for fetching all recipes
Recipe.getAllRecipes = async () => {
  try {
    return await Recipe.find({});
  } catch (error) {
    throw new Error(error.message);
  }
};

// Logic for fetching a single recipe by ID
Recipe.getRecipeById = async (id) => {
  try {
    return await Recipe.findById(id);
  } catch (error) {
    throw new Error(error.message);
  }
};

// Logic for updating a recipe by ID
Recipe.updateRecipeById = async (id, updatedData) => {
  try {
    return await Recipe.findByIdAndUpdate(id, updatedData, { new: true });
  } catch (error) {
    throw new Error(error.message);
  }
};

// Logic for deleting a recipe by ID
Recipe.deleteRecipeById = async (id) => {
  try {
    return await Recipe.findByIdAndDelete(id);
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = Recipe;
