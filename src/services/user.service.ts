import UserRepository from "../repositories/user.repository";
import bcrypt from "bcrypt";
import { IResposeUserDelete, IResponseUserUpdate, IUser, ServiceReturn, IUserWithGoogle } from "../types/user.entities";

const UserService = {
    createUser: async (user: IUser) => {
        try {
            const newUser = await UserRepository.createUser(user);

            return newUser;
        } catch (error) {
            console.log(error);
        }
    },

    getUserByEmail: async (email: string) => {
        try {
            const user = await UserRepository.getUser(email);
            return user;
        } catch (error) {
            console.log(error);
        }
    },

    updateUser: async (id: string, user: IUser) : Promise<ServiceReturn<IResponseUserUpdate>> => {
        try {
            const hashedPassword = await bcrypt.hash(user.password, 13);
            user.password = hashedPassword;
            const updatedUser = await UserRepository.updateUser(id, user);

            const dataUser : IResponseUserUpdate = {
                userId: updatedUser?.id as string,
                firstName: updatedUser?.firstName as string,
                lastName: updatedUser?.lastName as string,
                username: updatedUser?.username as string,
                email: updatedUser?.email as string,
                // password: updatedUser?.password as string
            }

            return { error: null, data: dataUser };
        } catch {
            return { error: new Error("Internal server error"), data: null };
        }
    },

    deleteUser: async (id: string) : Promise<ServiceReturn<IResposeUserDelete>> => {
        try {
            const deletedUser = await UserRepository.deleteUser(id);
            return { error: null, data: { userId: deletedUser?.id as string } };
        } catch {
            return { error: new Error("Internal server error"), data: null };
        }
    },

    createUserWithGoogle: async (user: IUserWithGoogle) => {
        try {
            const newUser = await UserRepository.createUserWithGoogle(user);
            return newUser;
        } catch {
            return { error: new Error("Internal server error"), data: null };
        }
    }
}

export default UserService;