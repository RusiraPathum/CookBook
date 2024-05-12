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
    timestamps: true, // Include the timestamps option inside the options object
  }
);

// Create the Recipe model
const Recipe = mongoose.model("Recipe", recipeSchema);

// Export the model
module.exports = Recipe;
