import { Request, Response } from 'express';
import { ZodError } from 'zod';
import AuthService from '../services/auth.service';
import ResponseHandler from '../utils/response-handler/response.handler';

const AuthController = {
    handleUserRegister: async (req: Request, res: Response) => {
        try {
            const { firstName, lastName, username, email, password } = req.body;
            const newUser = await AuthService.userRegister({ firstName, lastName, username, email, password });

            if (newUser.error !== null) {
                if (newUser.error instanceof ZodError) {
                    return ResponseHandler(res, 400, 'Invalid validation', newUser.error, null);
                }
                return ResponseHandler(res, 400, newUser.error.message, null, null);
            }

            return ResponseHandler(res, 200, 'User created', null, newUser.data);
        } catch (error) {
            if (error instanceof Error) {
                return ResponseHandler(res, 400, 'Invalid validation', error, null);
            }
        }
    },

    handleUserLogin: async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;

            const userLogin = await AuthService.userLogin(email, password);

            if (userLogin.error !== null) {
                if (userLogin.error instanceof ZodError) {
                    return ResponseHandler(res, 400, 'Invalid validation', userLogin.error, null);
                }
                return ResponseHandler(res, 400, userLogin.error.message, null, null);
            }

            return ResponseHandler(res, 200, 'User logged in', null, userLogin.data, [
                {
                    name: 'accessToken',
                    value: userLogin.data?.accessToken,
                    options: {
                        sameSite: 'none',
                    },
                },
                {
                    name: 'refreshToken',
                    value: userLogin.data?.refreshToken,
                    options: {
                        httpOnly: true,
                        sameSite: 'none',
                    },
                },
            ]);
        } catch (error) {
            if (error instanceof Error) {
                return ResponseHandler(res, 400, 'Invalid validation', error, null);
            }
        }
    },

    handleLogout: async (req: Request, res: Response) => {
        try {
            const { refreshToken } = req.cookies;

            await AuthService.userLogout(refreshToken);
            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');
            res.clearCookie('token');
            return ResponseHandler(res, 200, 'User logged out', null, null);
        } catch (error) {
            if (error instanceof Error) {
                return ResponseHandler(res, 400, 'Invalid validation', error, null);
            }
        }
    },

    handleRegisterWithGoogle: async (req: Request, res: Response) => {
        try {
            const { username, email } = req.body;
            const newUser = await AuthService.userRegisterWithGoogle({ username, email });

            return ResponseHandler(res, 200, 'User created', null, newUser);
        } catch (error) {
            if (error instanceof Error) {
                return ResponseHandler(res, 400, 'Invalid validation', error, null);
            }
        }
    },
};

export default AuthController;
