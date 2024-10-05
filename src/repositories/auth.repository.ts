import { get } from "mongoose";
import { Auth } from "../models/auth.schema";

const AuthRepository = {
    createAuth: async (userId: string, refreshToken: string) => {
        try {
            const newAuth = await Auth.create({ userId, refreshToken });
            await newAuth.save();
            return newAuth;
        } catch (error) {
            console.log(error);
        }
    },

    getAuth: async (refreshToken: string) => {
        try {
            const auth = await Auth.findOne({ refreshToken });
            console.log('auth repo: ', auth);
            return auth;
        } catch (error) {
            console.log(error);
        }
    },

    deleteAuth: async (refreshToken: string) => {
        try {
            const deletedAuth = await Auth.deleteOne({ refreshToken });
            return deletedAuth;
        } catch (error) {
            console.log(error);
        }
    }
}

export default AuthRepository;