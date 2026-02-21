import {Injectable} from "@nestjs/common"
import { db } from "src/database/db"    
import { User } from "./interfaces/user-interface"
import * as d from "drizzle-orm"
import { users } from "src/database/schemas" 
import { UUID } from "crypto"

@Injectable()
export class UsersService{

    async createUser(user: User){
        try{
            await db.insert(users).values(user).returning()
        }
       catch(error){
            return {message:'Error creating user', error} 
        }
       }

    async getAllUsers(){
        try{
            const data=await db.select().from(users)
            return {message:'Users found', data}
        }
        catch(error){
            return {message:'Error finding users', error}
        }
    }

    async getUserById(id:UUID){
        try{
           const getUsers= await db.select().from(users).where(d.eq(users.id,id))
              return {message:'User found', data:getUsers}
        }
        catch(error){
            return {message:'Error finding user', error} 
        }
    }

    async updateUser(id:UUID,user:User){
        try{
           await db.update(users).set(user).where(d.eq(users.id,id)).returning()
        }
        catch(error){
         return {message:'Error updating user', error} 
        }
    }

    async deleteUser(id:UUID){
        try{
            await db.delete(users).where(d.eq(users.id,id)).returning()
        }
        catch(error){
            return {message:'Error deleting user', error} 
        }
    }

}
