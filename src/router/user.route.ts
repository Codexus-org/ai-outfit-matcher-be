import express from 'express';
import UserController from '../controllers/user.controller';
import AuthController from '../controllers/auth.controller';
import authMiddleware from '../middleware/auth.middleware';

export const userRouter = express.Router();

userRouter.post('/register', AuthController.handleUserRegister);
userRouter.post('/login', AuthController.handleUserLogin);
userRouter.post('/logout', authMiddleware, AuthController.handleLogout);

userRouter.patch('/update', authMiddleware,UserController.handleUpdateUser);
userRouter.delete('/delete/:id', authMiddleware, UserController.handleDeleteUser);