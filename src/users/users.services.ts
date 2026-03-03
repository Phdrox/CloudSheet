import {Injectable} from "@nestjs/common"
import { db } from "src/database/db"    
import * as d from "drizzle-orm"
import { user } from "src/database/schemas" 
import { UUID } from "crypto"

@Injectable()
export class UsersService{

    async getAllUsers(){
        try{
            const data=await db.select().from(user)
            if(data.length===0){
                return {message:'Nenhum usuário encontrado'}
            }
            return {message:'Usurários encontrados', data}
        }
        catch(error){
            return {message:'Error ao busca usuários', error}
        }
    }

    async getUserById(id:UUID){
        try{
           const getUsers= await db.select().from(user).where(d.eq(user.id,id))
           if(getUsers.length===0){  
                return {message:'Usuário não encontrado'}
          }
           return {message:'Usuário encontrado', data:getUsers}
        }
        catch(error){
            return {message:'Error ao busca usuário', error} 
        }
    }

}
