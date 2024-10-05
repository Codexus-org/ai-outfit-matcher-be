import { userValidationSchema } from "../utils/zod/zod"
import { IUser } from "../types/user.entities";
import UserService from "./user.service";
import bcrypt from "bcrypt";

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
    }
}

export default AuthService;