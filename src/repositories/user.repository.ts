import bcrypt from 'bcrypt';
import { User } from "../models/user.schema";
import { IUser } from "../types/user.entities";
import { email } from 'envalid';

const UserRepository = {
    createUser: async (user: IUser) => {
        try {
            // const { firstName, lastName, username, email, password } = user;
            // const hashPassword = await bcrypt.hash(password, 13);
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