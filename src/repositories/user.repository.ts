import bcrypt from 'bcrypt';
import { User } from "../models/user.schema";
import { IUser } from "../types/user.entities";

const UserRepository = {
    createUser: async (user: IUser) => {
        try {
            const { firstName, lastName, username, email, password } = user;
            const hashPassword = await bcrypt.hash(password, 13);
            const newUser = new User({ firstName, lastName, username, email, password: hashPassword });
            const savedUser = await newUser.save();
            return savedUser;
        } catch (error) {
            console.log(error);
        }
    }
}

export default UserRepository;