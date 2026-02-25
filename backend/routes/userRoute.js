import express from 'express';
import { 
  registerUser, 
  loginUser, 
  getUser, 
  updateUser, 
  updatePassword 
} from '../controllers/userController.js'; // ✅ Import everything you use

import authMiddleware from '../middleware/auth.js';

const userRouter = express.Router();

// Public Routes
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);

// Private Routes
userRouter.get('/me', authMiddleware, getUser);
userRouter.put('/profile', authMiddleware, updateUser);
userRouter.put('/updatepassword', authMiddleware, updatePassword);

export default userRouter;
