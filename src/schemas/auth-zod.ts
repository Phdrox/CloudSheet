import {object,string,number,date,email,transform,refine} from "zod"

export const authSchema= object({
    email: email(),
    password: string().min(8).max(100),
    username: string().min(6).max(100),
})