import UserRepository from "../repositories/user.repository";
import { IUser } from "../types/user.entities";

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
    }
}

export default UserService;