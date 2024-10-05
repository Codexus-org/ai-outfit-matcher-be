import { z } from "zod";

const userValidationSchema = z.object({
    firstName: z.string().min(3, { message: "First name is required" }),
    lastName: z.string().min(3, { message: "Last name is required" }),
    username: z.string().min(3, { message: "Username is required" }),
    email: z.string().email({ message: "Email is required" }),
    password: z.string().min(8, { message: "Password is required" }),
});

const userLoginSchema = z.object({
    email: z.string().email({ message: "Email is required" }),
    password: z.string().min(8, { message: "Password is required" }),
})

export { userValidationSchema, userLoginSchema }