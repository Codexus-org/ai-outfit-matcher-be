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
    }
}

export default UserRepository;