import { z } from "zod";

const userValidationSchema = z.object({
    firstName: z.string().min(3, { message: "First name must be at least 3 characters" }),
    lastName: z.string().min(3, { message: "Last name must be at least 3 characters" }),
    username: z.string().min(3, { message: "Username must be at least 3 characters" }),
    email: z.string().email({ message: "Must be a valid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

const userLoginSchema = z.object({
    email: z.string().email({ message: "Must be a valid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
})

export { userValidationSchema, userLoginSchema }