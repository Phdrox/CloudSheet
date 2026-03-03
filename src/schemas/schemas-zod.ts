
import { object,string,number,date, uuid,coerce} from "zod";

export const schemaUser=object({
  name: string(),
  email: string(),
  password:string(),
  currentPassword:string()
})

export const schemaFlows=object({
    id_categories:number(),
    name:string().max(255),
    type:string().max(20),
    payment:string().max(40),
    price:number(),
    date:coerce.date(),
})

export const schemaGoal=object({
    id_user:uuid(),
    name:string().max(150),
    value:number(),
    have:number()
})



