const express = require('express');
const { check } = require('express-validator');
const { registerUser, loginUser } = require('../controllers/authController');
const multer = require('multer');

const router = express.Router();

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/');
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '-' + file.originalname);
//   }
// });

// const upload = multer({ storage: storage });

router.post('/register',[
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
], registerUser);

router.post('/login', loginUser);

module.exports = router;