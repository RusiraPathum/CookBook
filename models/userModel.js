const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Define the schema for the User model.
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter a name"],
    },
    email: {
      type: String,
      required: [true, "Please enter an email address"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please enter a password"],
    },
    profilePicture: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Hash the password before saving the user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Create the User model
const User = mongoose.model("User", userSchema);

// Logic for creating a user (registration)
User.createUser = async (userData) => {
  try {
    const user = new User(userData);
    const savedUser = await user.save(); // Save the user
    return savedUser; // Return the saved user object
  } catch (error) {
    throw new Error(error.message); // Throw an error if saving fails
  }
};

// Logic for finding a user by email
User.findUserByEmail = async (email) => {
  try {
    return await User.findOne({ email });
  } catch (error) {
    throw new Error(error.message);
  }
};

// Logic for finding a user by ID
User.findUserById = async (id) => {
  try {
    return await User.findById(id);
  } catch (error) {
    throw new Error(error.message);
  }
};

// Logic for updating user profile by ID
User.updateUserProfileById = async (id, updatedData) => {
  try {
    if (updatedData.password) {
      const salt = await bcrypt.genSalt(10);
      updatedData.password = await bcrypt.hash(updatedData.password, salt);
    }
    return await User.findByIdAndUpdate(id, updatedData, { new: true });
  } catch (error) {
    throw new Error(error.message);
  }
};

// Logic for comparing passwords
User.comparePassword = async function (enteredPassword, storedPassword) {
  try {
    return await bcrypt.compare(enteredPassword, storedPassword);
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = User;
