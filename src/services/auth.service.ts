import { userLoginSchema, userValidationSchema } from "../utils/zod/zod"
import { IResponseUserLogout,IResponseUserLogin, IResponseUserRegister, IUser, ServiceReturn, IUserWithGoogle } from "../types/user.entities";
import UserService from "./user.service";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import AuthRepository from "../repositories/auth.repository";

const AuthService = {
    userRegister: async (user: IUser) : Promise <ServiceReturn<IResponseUserRegister>> => {
        try {
            const userValidated = userValidationSchema.safeParse(user);

            if (!userValidated.success) {
                return { error: userValidated.error, data: null };
            }
            
            const isUserRegistered = await UserService.getUserByEmail(user.email);
            if (isUserRegistered) {
                return { error: new Error("User already registered"), data: null };
            }

            const hashPassword = await bcrypt.hash(user.password, 13);
            
            const newUser = await UserService.createUser({...user, password: hashPassword});

            const payload : IResponseUserRegister= {
                userId: newUser?.id as string,
                email: newUser?.email as string,
                username: newUser?.username as string,
                firstName: newUser?.firstName as string,
                lastName: newUser?.lastName as string
            };

            return { error: null, data: payload };
        } catch {
            return { error: new Error("Internal server error"), data: null };
        }
    },

    userLogin : async (email: string, password: string) : Promise <ServiceReturn<IResponseUserLogin>> => {
        try {
            const userValidated = userLoginSchema.safeParse({ email, password });
            
            if (!userValidated.success) {
                return { error: userValidated.error, data: null };
            }

            // check user by email
            const user = await UserService.getUserByEmail(email);

            if (!user) {
                return { error: new Error("Invalid credentials"), data: null };
            }

            const isPasswordMatch = await bcrypt.compare(password, user.password as string);

            if (!isPasswordMatch) {
                return { error: new Error("Invalid credentials"), data: null };
            }

            const payload = {
              id: user.id as string,
              email: user.email as string,
              username: user.username as string
            };

            //create token
            const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET as string, { expiresIn: 300 });
            const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, { expiresIn: "7d" });
            
            const userId = user.id;

            await AuthRepository.createAuth(userId, refreshToken);

            return { error: null, data: { payload, accessToken, refreshToken } };
        } catch {
            return { error: new Error("Internal server error"), data: null };
        }
    },

    userLogout: async (refreshToken: string) : Promise<ServiceReturn<IResponseUserLogout>> => {
        try {
            await AuthRepository.deleteAuth(refreshToken);

            return { error: null, data: { refreshToken } };
        } catch {
            return { error: new Error("Internal server error"), data: null };
        }
    },

    userRegisterWithGoogle: async (user: IUserWithGoogle) => {
      try {
        const newUser = await UserService.createUserWithGoogle(user);
        return newUser;
      } catch {
        return { error: new Error("Internal server error"), data: null };
      }
    } 
}

export default AuthService;