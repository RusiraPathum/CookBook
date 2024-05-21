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
    status: {
      type: Boolean,
      default: true,
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
    // console.log(recipeData);
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

// Logic for updating recipe status by ID
Recipe.updateRecipeStatusById = async (id, status) => {
  try {
    return await Recipe.findByIdAndUpdate(id, { status: status }, { new: true });
  } catch (error) {
    throw new Error(error.message);
  }
};

// Define a static method to count the number of active recipes
Recipe.countActiveRecipes = async function() {
  try {
      // Count the number of documents (recipes) where the 'active' field is true
      const activeRecipeCount = await this.countDocuments({ status: true });
      return activeRecipeCount;
  } catch (error) {
      // If there's an error, throw it
      throw error;
  }
};

// Define a static method to count the number of inactive recipes
Recipe.countInactiveRecipes = async function() {
  try {
      // Count the number of documents (recipes) where the 'active' field is true
      const inactiveRecipeCount = await this.countDocuments({ status: false });
      return inactiveRecipeCount;
  } catch (error) {
      // If there's an error, throw it
      throw error;
  }
};

// Model method to fetch recipe status data
Recipe.getRecipeStatusChartData = async function() {
  try {
    const statusData = await Recipe.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $project: { _id: 0, status: "$_id", count: 1 } }
    ]);
    return statusData;
  } catch (error) {
    throw new Error("Failed to fetch recipe status data");
  }
};

module.exports = Recipe;
