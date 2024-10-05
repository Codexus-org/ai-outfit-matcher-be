import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import AuthService from "../services/auth.service";
import ResponseHandler from "../utils/response-handler/response.handler";

const AuthController = {
    handleUserRegister : async (req: Request, res: Response) => {
        try {
            const { firstName, lastName, username, email, password } = req.body;
            const newUser = await AuthService.userRegister({ firstName, lastName, username, email, password });

            if (newUser.error !== null) {
                if (newUser.error instanceof ZodError) {
                    return ResponseHandler(res, 400, "Invalid validation", newUser.error, null);
                }
                return ResponseHandler(res, 400, newUser.error.message, null, null);
            }

            return ResponseHandler(res, 200, "User created", null, newUser.data);
        } catch (error) {
            if (error instanceof Error) {
                return ResponseHandler(res, 400, "Invalid validation", error, null);
            }
        }
    },

    handleUserLogin : async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            
            const userLogin = await AuthService.userLogin(email, password);
            
            if (userLogin.error !== null) {
                if (userLogin.error instanceof ZodError) {
                    return ResponseHandler(res, 400, "Invalid validation", userLogin.error, null);
                }
                return ResponseHandler(res, 400, userLogin.error.message, null, null);
            }
            
            return ResponseHandler(res, 200, "User logged in", null, userLogin.data, [
                { 
                    name: "accessToken",
                    value: userLogin.data?.accessToken,
                    options: {
                        httpOnly: true
                    }
                },
                {
                    name: "refreshToken",
                    value: userLogin.data?.refreshToken,
                    options: {
                        httpOnly: true
                    }
                }
            ]);
        } catch (error) {
            if (error instanceof Error) {
                return ResponseHandler(res, 400, "Invalid validation", error, null);
            }
        }
    },

    handleLogout : async (req: Request, res: Response, next: NextFunction) => {
        const { refreshToken } = req.cookies;

        try {
            await AuthService.userLogout(refreshToken);

            return res
                .clearCookie("accessToken")
                .clearCookie("refreshToken")
                .status(200)
                .json({ message: "User logged out" });
        } catch (error) {
            next(error);
        }
    }
}

export default AuthController;