import express from 'express';
import { registerUser, loginUser, getUserInfo, logoutUser } from '../controllers/user.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js'; // Add this import

const router = express.Router();

// Register with optional profile image
router.post('/register', upload.single('profileImage'), registerUser);

// Login (no file upload needed)
router.post('/login', loginUser);

// Get user profile
router.get('/profile', authenticate, getUserInfo);

// Update user profile with optional image

// Logout
router.post('/logout',authenticate, logoutUser);

export default router;