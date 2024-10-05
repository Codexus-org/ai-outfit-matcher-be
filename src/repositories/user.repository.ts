import { User } from "../models/user.schema";
import { IUser } from "../types/user.entities";

const UserRepository = {
    createUser: async (user: IUser) => {
        try {
            const newUser = new User(user);
            const savedUser = await newUser.save();
            return savedUser;
        } catch (error) {
            console.log(error);
        }
    },

    getUser: async (email:string) => {
        try {
            const user = await User.findOne({ email });
            return user;
        } catch (error) {
            console.log(error);
        }
    },

    updateUser: async (id: string, user: IUser) => {
        try {
            const updatedUser = await User.findByIdAndUpdate(id, user, { new: true });
            return updatedUser;
        } catch (error) {
            console.log(error);
        }
    },

    deleteUser: async (id: string) => {
        try {
            const deletedUser = await User.findByIdAndDelete(id);
            return deletedUser;
        } catch (error) {
            console.log(error);
        }
    }
}

export default UserRepository;