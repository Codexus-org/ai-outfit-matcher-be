import express from 'express';
import UserController from '../controllers/user.controller';
import AuthController from '../controllers/auth.controller';
import authMiddleware from '../middleware/auth.middleware';
import { generateState, generateCodeVerifier } from 'arctic';
import { google } from '../utils/oauth-config/arctic';
import UserService from '../services/user.service';
import AuthService from '../services/auth.service';
import jwt from "jsonwebtoken";
import { IUser } from '../types/user.entities';
import AuthRepository from '../repositories/auth.repository';

export const userRouter = express.Router();

userRouter.post('/register', AuthController.handleUserRegister);
userRouter.post('/login', AuthController.handleUserLogin);
userRouter.post('/logout', authMiddleware, AuthController.handleLogout);

userRouter.patch('/update', authMiddleware,UserController.handleUpdateUser);
userRouter.delete('/delete/:id', authMiddleware, UserController.handleDeleteUser);

userRouter.post('/continue-with-google', async (req, res) => {
    const state = generateState();
    const codeVerifier = generateCodeVerifier();

    const url = await google.createAuthorizationURL(state, codeVerifier, {
        scopes: ["profile", "email"],
    });

    return res.cookie("codeVerifier", codeVerifier).redirect(url.href);
});

userRouter.get("/login/google/callback", async (req, res) => {
    const code = req.query.code as string;
    const state = req.query.state as string;

    // get token from cookie
    const codeVerifier = req.cookies.codeVerifier;
    // return res.json({code, state, codeVerifier})

    // checking
    if (!code || !state || !codeVerifier) {
        return res.json({ message: "Invalid request" });
    }

    const tokens = await google.validateAuthorizationCode(code, codeVerifier);

    const response = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
        headers: {
            Authorization: `Bearer ${tokens.accessToken}`,
        },
    });

    const user = await response.json();

    return res.json({user})
    // // Login strategy

    // // Check user if exist
    const findUser = await UserService.getUserByEmail(user.email);

    if (!findUser) {
        const newUser = await AuthService.userRegister(user as IUser);

        // Generate Session ID
        const payload = {
                id: newUser?.data?.userId as string,
                username: newUser?.data?.username as string,
                email: newUser?.data?.email as string
        };

        //create token
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET as string, { expiresIn: 300 });
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, { expiresIn: "7d" });
        
        const userId = user.id;

        await AuthRepository.createAuth(userId, refreshToken);

        return res
         .cookie("refreshToken", refreshToken, { httpOnly: true })
         .cookie("accessToken", accessToken)
         .cookie("user", JSON.stringify(payload))
         .status(200)
         .redirect("http://localhost:5173/");
    }
    
    const payload = {
        id: findUser?.id as string,
        username: findUser?.username as string,
        email: findUser?.email as string
    };

    // //create token
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET as string, { expiresIn: 300 });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, { expiresIn: "7d" });

    const userId = user.id;

    await AuthRepository.createAuth(userId, refreshToken);

    return res
         .cookie("refreshToken", refreshToken, { httpOnly: true })
         .cookie("accessToken", accessToken)
         .cookie("user", JSON.stringify(payload))
         .status(200)
         .redirect("http://localhost:5173/");
})