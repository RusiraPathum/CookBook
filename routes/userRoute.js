const express = require('express');
const { getUserProfile, updateUserProfile } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
// const multer = require('multer');

const router = express.Router();
// const upload = multer({ dest: 'uploads/' });

router.get('/profile', authMiddleware, getUserProfile);
router.put('/profile', authMiddleware, updateUserProfile);

module.exports = router;