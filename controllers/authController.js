const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const path = require("path");

// Helper function to handle error responses
const handleErrorResponse = (res, error) => {
  console.error(error.message);
  res.status(500).json({ message: error.message });
};

// User Registration
const registerUser = async (req, res) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;
  const profilePicture = req.file ? path.join('/uploads', req.file.filename) : null;

  try {
    let user = await User.findUserByEmail(email);

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const userData = {
      name,
      email,
      password,
      profilePicture
    };

    user = User.createUser(userData);

    const payload = { userId: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
  
    return res.status(200).json({ user });
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

// User Login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findUserByEmail(email);

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await User.comparePassword(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const payload = { userId: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ token });
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

// Get User Profile
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findUserById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

const updateUserProfile = async (req, res) => {
  console.log("body",req.body)
  const { name, email, password } = req.body;
  const userId = req.user.userId;

  try {
    const updates = { name, email };

    // Check if password exists in the request body
    if (password) {
      updates.password = password;
    }

    if (req.file) {
      updates.profilePicture = path.join("/uploads", req.file.filename);
    }

    const user = await User.updateUserProfileById(userId, updates);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
};
