import * as z from 'zod'

export const SignUpValidation = z.object({
    name: z.string(),
    username: z.string().min(2, { message: "Too Short" }).max(50),
    email: z.string().email({ message: "Email format should be correct!" }),
    password: z.string().min(8, { message: "Password length must be at least 8 characters long!" })
});

export const SignInValidation = z.object({
    userOrEmail: z.string(),
    password: z.string()
})