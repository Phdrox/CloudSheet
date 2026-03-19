import {Injectable} from "@nestjs/common"
import { db } from "../database/db.js"    
import * as d from "drizzle-orm"
import { account } from "../database/schemas.js" 
import { UUID } from "crypto"
import {hash} from "argon2"

export type User={
    email:string;
    name:string;
    password:string;
}

@Injectable()
export class UsersService {

        async getAllUsers(){
            const collumAccoun={id:account.id,name:account.name,email:account.email,created:account.createdAt}
            try{
                const data=await db.select(collumAccoun).from(account)
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
            const collumAccoun={id:account.id,name:account.name,email:account.email,created:account.createdAt,type:account.type}
            try{
               const getUsers= await db.select(collumAccoun).from(account).where(d.eq(account.id,id))
               if(getUsers.length===0){  
                    return {message:'Usuário não encontrado'}
              }
               return {message:'Usuário encontrado', data:getUsers}
            }
            catch(error){
                return {message:'Erro ao busca usuário', error} 
            }
        }

        async putUserById(id:UUID,body:User,type){
            try{
                await db.update(account)
                .set({...body,type})
                .where(d.eq(account.id,id))
            }
            catch(error){
                return {message:'Erro ao atualizar usuário',error}
            }
        }
        
        async createUser(body:User){
            try{
                await db.insert(account).values({...body,password:await hash(body.password)})
                return {message:"Usuário criado com successo"}
            }
            catch(error){
                return {message:'Erro ao criar usuário',error}
            }
        }

        async deleteUser(id:UUID){
            try{
                await db.delete(account).where(d.eq(account.id,id))
                return {message:"Usuário deletado com successo"}
            }
            catch(error){
                return {message:'Erro ao deletar usuário',error}
            }
        }   

        async userAuth(email:string){
            if(email){
                try {
                   const data= await db.select()
                   .from(account)
                   .where(d.eq(account.email,email))
                    return {data}
                }catch(error){
                    return {message:"Email inválido"}
                }
            }
        }
}
