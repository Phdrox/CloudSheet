import { Injectable } from "@nestjs/common"
import {JwtService} from "@nestjs/jwt"
import { createHash } from "crypto"
import { db } from "src/database/db"
import { User } from "../users/interfaces/user-interface"
import { eq } from "drizzle-orm"
import {  users } from "src/database/schemas"
import { verify } from "argon2"
import { betterAuth } from "better-auth"


@Injectable()
export class AuthService{
    constructor(
        private db=db,
        private auth=betterAuth({emailAndPassword:{enabled:true}})
    ){}
    
    async login(email,password:string){
        const user:User= await this.db.select().from(users).where(eq(users.email,email)).first()
                
        if(!user){
            return {message:"User not found"}
        }

        const isPasswordValid= await verify(user.password,password)
        if(!isPasswordValid){
            return  {message:"Invalid credentials"}
        }

        try{
            this.auth.api.signInEmail({
                body:{
                    email:email,
                    password:password,
                    rememberMe:true,
                    callbackURL:"/dashboard"
                }
            })
        }
        catch(error){
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
