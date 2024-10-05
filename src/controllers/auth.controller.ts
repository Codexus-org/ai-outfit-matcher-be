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
    }
}

export default AuthController;