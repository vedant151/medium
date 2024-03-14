import { z } from "zod"

export const signupInput = z.object({
    email: z.string().email(),
    password: z.string().min(6)

})

// type inference in zod 
export type SignupInput = z.infer<typeof signupInput>

// -------------------------------

export const signinInput = z.object({
    email: z.string().email(),
    password: z.string().min(6)

})

// type inference in zod 
export type SigninInput = z.infer<typeof signinInput>

export const creatBlogInput = z.object({
    title: z.string(),
    content: z.string()
})

// type inference in zod 
export type CreatBlogInput = z.infer<typeof creatBlogInput>



export const updateBlogInput = z.object({
    title: z.string(),
    content: z.string(),
    id: z.string()
})

// type inference in zod 
export type UpdateBlogInput = z.infer<typeof updateBlogInput>
