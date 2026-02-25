import { Injectable,Inject } from "@nestjs/common"
import { db } from "src/database/db"
import { eq } from "drizzle-orm"
import {  users } from "src/database/schemas"
import { verify } from "argon2"
import { schemaAuth } from "src/schemas/schemas-zod"
import type{ IAuth,AuthType } from "./interfaces/auth-type"




@Injectable()
export class AuthService{
    constructor (
        @Inject("AUTH") private readonly auth:AuthType
    ){}
    
    async login({email,password}:IAuth){

        const validate= await schemaAuth.safeParseAsync({email,password})
        if(validate.success){

        const user:any= await db.select().from(users).where(eq(users.email,email))
                
            if(!user){
                return {message:"User not found"}
            }

            const isPasswordValid= await verify(user.password,password)

            if(!isPasswordValid){
                return  {message:"Invalid credentials"}
            }
            
            this.auth.api.signInEmail({
                body:{
                    email,
                    password,
                    rememberMe:true,
                    callbackURL:"/dashboard"
                }
            })
        }else{
            return {message:"Error signing in"}
        }
        
    }

   async logout(){
      try{
          await this.auth.api.signOut();
      }
      catch(error){
          return {message:"Error signing out"}
      }
   }
}
