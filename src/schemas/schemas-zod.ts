
import { object,string,number,uuid,coerce,date} from "zod";

export const schemaUser=object({
  name: string(),
  email: string(),
  password:string(),
  currentPassword:string()
})

export const schemaFlows=object({
    id_categories:string(),
    id_account:uuid(),
    name:string(),
    type:string().max(20),
    payment:string().max(40),
    price:string(),
    date:string(),
})

export const schemaGoal=object({
    id_user:uuid(),
    name:string(),
    value:string(),
    have:string()
})



