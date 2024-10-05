import { Schema, model } from "mongoose";

const userSchema = new Schema(
    {
        firstName: String,
        lastName: String,
        username: String,
        email: String,
        password: String,
    },
    { versionKey: false },
);

export const User = model("User", userSchema);