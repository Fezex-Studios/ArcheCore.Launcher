import {z} from "zod";

export const authSchema = z.object({
    username: z
        .string()
        .min(5,"Username Must be greater than 5 characters"),
    password: z
        .string()

})
