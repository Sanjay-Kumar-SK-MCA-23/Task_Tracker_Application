import express from 'express';
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', registerUser);
router.post('/login', authUser);
router.post('/logout', logoutUser);
router.route('/profile')
router.get('/profile',protect, getUserProfile)
router.put('/profile',protect, updateUserProfile);

export default router;
