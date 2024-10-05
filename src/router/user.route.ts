import express from 'express';
import UserController from '../controllers/user.controller';
import AuthController from '../controllers/auth.controller';

export const userRouter = express.Router();

userRouter.post('/register', AuthController.handleUserRegister);