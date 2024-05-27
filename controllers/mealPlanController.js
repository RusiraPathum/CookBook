const MealPlan = require("../models/mealPlanModel.js");
const Recipe = require("../models/recipeModel.js");
const path = require("path");

// Create meal plan method
const createMealPlan = async (req, res) => {
    try {
      const { title, date } = req.body;
      const mealPlanData = {
        title,
        date,
        userId: req.user.userId,
      };
      console.log('mealPlanData', mealPlanData);
  
      const mealPlan = await MealPlan.createMealPlan(mealPlanData);
      res.status(200).json({ mealPlan });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: error.message });
    }
  };
  

// Get all meal plans method
const getAllMealPlans = async (req, res) => {
  try {
    const mealPlans = await MealPlan.getAllMealPlans();
    res.status(200).json({ mealPlans });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

// Get single meal plan method
const getMealPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const mealPlan = await MealPlan.getMealPlanById(id);
    if (!mealPlan) {
      res.status(404);
      throw new Error(`Cannot find any meal plan with ID ${id}`);
    }
    res.status(200).json({ mealPlan });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

// Update meal plan method
const updateMealPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedMealPlan = await MealPlan.updateMealPlanById(id, updatedData);
    if (!updatedMealPlan) {
      res.status(404);
      throw new Error(`Cannot find any meal plan with ID ${id}`);
    }
    res.status(200).json(updatedMealPlan);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

// Delete meal plan method
const deleteMealPlan = async (req, res) => {
    try {
      const { id } = req.params;
      const deletedMealPlan = await MealPlan.findByIdAndDelete(id);
  
      if (!deletedMealPlan) {
        res.status(404);
        throw new Error(`Cannot find any meal plan with ID ${id}`);
      }
  
      res.status(200).json(deletedMealPlan);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: error.message });
    }
  };

const searchMealPlans = async (req, res) => {
  try {
    const query = req.query.query || "";

    const mealPlans = await MealPlan.searchMealPlans(query);

    res.status(200).json({ mealPlans });
  } catch (error) {
    console.error("Error searching meal plans:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getRecipesForSelect = async (req, res) => {

    console.log('dadasdasda');
    try {
      const recipes = await Recipe.find({}, '_id title'); // Fetch only _id and title fields
      res.status(200).json({ recipes });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Failed to fetch recipes for select input.' });
    }
  };

module.exports = {
  createMealPlan,
  getAllMealPlans,
  getMealPlan,
  updateMealPlan,
  deleteMealPlan,
  searchMealPlans,
  getRecipesForSelect
};
