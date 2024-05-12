const mongoose = require("../dbConnection");
// let collection;

// Define the schema for the Recipe model
const recipeSchema = new mongoose.Schema({
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
    required: [true, "Please add a image"],
  },
  timestamps: true,
});

// Create the Recipe model
const Recipe = mongoose.model("Recipe", recipeSchema);

// Export the model
module.exports = Recipe;
