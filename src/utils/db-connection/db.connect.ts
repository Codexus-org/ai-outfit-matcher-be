import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const dbConnect = async () => {
    await mongoose
        .connect(process.env.MONGO_URI as string)
        .then(() => {
            console.log("Connected to MongoDB");
        })
        .catch((error) => {
            console.log("Mongodb connection failed")
            console.log(error);
        });
}