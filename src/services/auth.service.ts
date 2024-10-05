import { userValidationSchema } from "../utils/zod/zod"
import { IUser } from "../types/user.entities";
import UserService from "./user.service";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import AuthRepository from "../repositories/auth.repository";

const AuthService = {
    userRegister: async (user: IUser) => {
        try {
            const userValidated = userValidationSchema.safeParse(user);

            if (!userValidated.success) {
                return userValidated.error;
            }
            
            const isUserRegistered = await UserService.getUserByEmail(user.email);
            if (isUserRegistered) {
                return { message: "User already exists"};
            }

            const hashPassword = await bcrypt.hash(user.password, 13);
            
            const newUser = await UserService.createUser({...user, password: hashPassword});
            return newUser;
        } catch (error) {
            console.log(error);
        }
    },

    userLogin : async (email: string, password: string) => {
        try {
            const userValidated = userValidationSchema.safeParse({ email, password });
            
            if (!userValidated.success) {
                return userValidated.error;
            }

            // check user by email
            const user = await UserService.getUserByEmail(email);

            if (!user) {
                return { message: "invalid credentials" };
            }

            const isPasswordMatch = await bcrypt.compare(password, user.password as string);

            if (!isPasswordMatch) {
                return { message: "invalid credentials" };
            }

            const payload = {
                id: user.id,
                email: user.email
            };

            //create token
            const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET as string, { expiresIn: 300 });
            const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, { expiresIn: "7d" });

            const userId = user.id;

            await AuthRepository.createAuth(userId, refreshToken);

            return { userId, accessToken, refreshToken };
        } catch (error) {
            console.log(error);
        }
    }
}

export default AuthService;