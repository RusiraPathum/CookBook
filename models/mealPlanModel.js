const mongoose = require("mongoose");

// Define the schema for the MealPlan model
const mealPlanSchema = mongoose.Schema(
  {
    title: {
      type: String,
      // required: [true, "Please enter a meal plan name"],
    },
    date: {
      type: Date,
      // required: [true, "Please select a date for the meal plan"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create the MealPlan model
const MealPlan = mongoose.model("MealPlan", mealPlanSchema);

// Logic for creating a meal plan
MealPlan.createMealPlan = async (mealPlanData) => {
  try {
    return await MealPlan.create(mealPlanData);
  } catch (error) {
    throw new Error(error.message);
  }
};

// Logic for fetching all meal plans
MealPlan.getAllMealPlans = async () => {
  try {
    return await MealPlan.find({});
  } catch (error) {
    throw new Error(error.message);
  }
};

MealPlan.deleteMealPlanById = async (id) => {
  try {
    // Check if the ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid meal plan ID');
    }
    
    // Find and delete the meal plan by ID
    return await MealPlan.findByIdAndDelete(id);
  } catch (error) {
    throw new Error(error.message);
  }
};

// Logic for fetching a single meal plan by ID
MealPlan.getMealPlanById = async (id) => {
  try {
    return await MealPlan.findById(id);
  } catch (error) {
    throw new Error(error.message);
  }
};

// Logic for updating a meal plan by ID
MealPlan.updateMealPlanById = async (id, updatedData) => {
  try {
    return await MealPlan.findByIdAndUpdate(id, updatedData, { new: true });
  } catch (error) {
    throw new Error(error.message);
  }
};

// Logic for deleting a meal plan by ID
MealPlan.deleteMealPlanById = async (id) => {
  try {
    return await MealPlan.findByIdAndDelete(id);
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = MealPlan;
