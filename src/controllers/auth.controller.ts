import { Request, Response } from "express";
import AuthService from "../services/auth.service";

const AuthController = {
    handleUserRegister : async (req: Request, res: Response) => {
        const { firstName, lastName, username, email, password } = req.body;
        const newUser = await AuthService.userRegister({ firstName, lastName, username, email, password });

        if (!newUser) {
            return res.status(401).json({message: 'Failed create user'})
        }

        try {
            return res.status(201).json({ message: "User created", data: newUser });
        } catch (error) {
            console.log(error);
        }
    },

    handleUserLogin : async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            const userLogin = await AuthService.userLogin(email, password);

            const { accessToken, refreshToken } = userLogin as { accessToken: string; refreshToken: string; };

            return res
                    .cookie("accessToken", accessToken, { httpOnly: true })
                    .cookie("refreshToken", refreshToken, { httpOnly: true })
                    .status(200)
                    .json({ message: "User logged in"});
        } catch (error) {
            if (error instanceof Error) {
                return res.status(401).json({ message: error.message });
            }
        }
    }
}

export default AuthController;