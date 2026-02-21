import {Injectable} from "@nestjs/common"
import { db } from "src/database/db"    
import { IUser } from "./interfaces/user-interface"
import * as d from "drizzle-orm"
import { users } from "src/database/schemas" 
import { UUID } from "crypto"
import { hash } from "argon2"

@Injectable()
export class UsersService{

    async createUser(user: IUser){
        try{
            await db.insert(users).values({...user,password:await hash(user.password)}).returning()
            return {message:'User created successfully'}
        }
       catch(error){
            return {message:'Error creating user', error} 
        }
       }

    async getAllUsers(){
        try{
            const data=await db.select().from(users)
            if(data.length===0){
                return {message:'No users found'}
            }
            return {message:'Users found', data}
        }
        catch(error){
            return {message:'Error finding users', error}
        }
    }

    async getUserById(id:UUID){
        try{
           const getUsers= await db.select().from(users).where(d.eq(users.id,id))
           if(getUsers.length===0){  
                return {message:'User not found'}
          }
           return {message:'User found', data:getUsers}
        }
        catch(error){
            return {message:'Error finding user', error} 
        }
    }

    async updateUser(id:UUID,user:IUser){
        try{
           await db.update(users).set(user).where(d.eq(users.id,id)).returning()
           return {message:'User updated successfully'}
        }
        catch(error){
         return {message:'Error updating user', error} 
        }
    }

    async deleteUser(id:UUID){
        try{
            await db.delete(users).where(d.eq(users.id,id)).returning()
            return {message:'User deleted successfully'}
        }
        catch(error){
            return {message:'Error deleting user', error} 
        }
    }

}
