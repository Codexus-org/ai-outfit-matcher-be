import { Request, Response } from "express";
import UserService from "../services/user.service";
import jwt from "jsonwebtoken";
import ResponseHandler from "../utils/response-handler/response.handler";

const UserController = {
    handleUpdateUser : async (req: Request, res: Response) => {
        try {
            const { accessToken } = req.cookies;
            const payload = jwt.decode(accessToken) as { id: string, firstName: string, lastName: string, username: string, email: string, password: string };

            const { firstName, lastName, username, email, password } = req.body;

            const updateUser = await UserService.updateUser(payload.id, { firstName, lastName, username, email, password });

            return ResponseHandler(res, 200, "User updated", null, updateUser);
        } catch (error) {
            if (error instanceof Error) {
                return ResponseHandler(res, 400, "Invalid validation", error, null);
            }
        }
    },

    handleDeleteUser : async (req: Request, res: Response) => {
        try {
            const { accessToken } = req.cookies;

            console.log(accessToken);

            const payload = jwt.decode(accessToken) as { id: string, firstName: string, lastName: string, username: string, email: string, password: string };
            
            console.log(payload);

            await UserService.deleteUser(payload.id);

            return ResponseHandler(res, 200, "User deleted", null, null);
        } catch (error) {
            if (error instanceof Error) {
                return ResponseHandler(res, 400, "Invalid validation", error, null);
            }
        }
    }
}

export default UserController;