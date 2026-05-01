import {Injectable, UnauthorizedException} from "@nestjs/common"
import { db } from "../database/db.js"    
import * as d from "drizzle-orm"
import { account } from "../database/schemas.js" 
import { UUID } from "crypto"
import {hash,verify} from "argon2"
import { JwtService } from "@nestjs/jwt"
import { eq } from 'drizzle-orm';

export type User={
    email:string;
    name:string;
    password:string;
}

@Injectable()
export class UsersService {

       constructor(
        private jwtService:JwtService,
       ){}
        async getAllUsers(){
            const collumAccount={id:account.id,name:account.name,email:account.email,created:account.createdAt}
            try{
                const data=await db.select(collumAccount).from(account)
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

        async putUserById(id:UUID,body:User,type:any){
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
           const verifyEmail=await db.select({email:account.email}).from(account);
           verifyEmail ?? {message:'Email já existe'}; 
           
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

         async saveRefreshToken(id: string, refresh_token: string) {
            await db.update(account)
            .set({ token: await hash(refresh_token) })
            .where(d.eq(account.id, id));
    }

        async validateAndRotateRefreshToken(id:string,refresh_token:string){
                try{
                 const user=await db.select().from(account).where(d.eq(account.id,id))
                 
                 if(user.length===0){
                    throw new UnauthorizedException("Token inválido");
                 }

                if (!user[0].token) {
                    throw new UnauthorizedException("Sem sessão ativa");
                }

                const isMatch = await verify(user[0].token, refresh_token);
                if (!isMatch) {
                    throw new UnauthorizedException("Token inválido");
                }           
                 
                 const newPayload={id:user[0].id,name:user[0].name,email:user[0].email};
                 
                 const new_access_token= await this.jwtService.signAsync(
                    {...newPayload,type:'access'},
                    {expiresIn:"15m"}
                )
                 
                const new_refresh_token= await this.jwtService.signAsync(
                    {...newPayload,type:'refresh'},
                    {expiresIn:"7d"}
                )

                 await this.saveRefreshToken(id,new_refresh_token)
                 
                 return {new_access_token,new_refresh_token};
                }catch(error:any){
                    throw new UnauthorizedException("Falha crítica no refresh: " + error.message);
                }
        }

        async sendEmail(email:string){
            const geradorDeCodigo=()=>{
                const caracteres= "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
                let resultado="";
                for (let i=0;i<5;i++){
                    const indiceAleatorio=Math.floor(Math.random() * caracteres.length);
                    resultado+=caracteres.charAt(indiceAleatorio);
                }
                return resultado
            }

            const user= await db.select().from(account).where(eq(account.email,email))
            if(user.length>0 && user){
                const novoCodigo=geradorDeCodigo()
                try{
                    await db.update(account).set({code:novoCodigo}).where(eq(account.email,email))

                    return {code:novoCodigo}
                }catch(error){
                    return {error}
                }
            }
        }

        async resetPassword(password:string,code:string){
           const codePass= await db.select({code:account.code})
                .from(account)
                .where(eq(account.code,code))
           
            try{
              if(codePass){
                await db.update(account).set({password:await hash(password)}).where(eq(account.code, code));
                await db.update(account).set({code:''}).where(eq(account.code, code));
                return {message:'Senha atualizada com sucesso'}
              }else{
                return {error:"Falha ao resetar senha"}
              }
          }catch(err){
            return {error:err}
          }
        }
}
