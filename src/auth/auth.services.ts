import { Injectable } from "@nestjs/common"
import { db } from "src/database/db"
import { IUser } from "../users/interfaces/user-interface"
import { eq } from "drizzle-orm"
import {  users } from "src/database/schemas"
import { verify } from "argon2"
import { betterAuth } from "better-auth"
import { schemaAuth } from "src/schemas/schemas-zod"
import type{ IAuth } from "./interfaces/auth-type"


@Injectable()
export class AuthService{
    constructor(
        private db=db,
        private auth=betterAuth({emailAndPassword:{enabled:true}})
    ){}
    
    async login({email,password}:IAuth){

        const validate= await schemaAuth.safeParseAsync({email,password})
        if(validate.success){

        const user:IUser= await this.db.select().from(users).where(eq(users.email,email)).first()
                
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
