
import { object,string,number,date, email } from "zod";

export const schemaUser=object({
    name:string().max(255),
    username:string().min(100),
    email:string().max(260),
    password: string(),
})

export const schemaFlows=object({
    id_categorie:number(),
    name:string().max(255),
    type:string().max(20),
    payment:string().max(40),
    price:number(),
    date:date(),
})

export const schemaGoal=object({
    id_user:string(),
    id_categories:number(),
    name:string().max(150),
    value:number(),
    have:number()
})

export const schemaAuth=object({
    email:email(),
    password:string()
})