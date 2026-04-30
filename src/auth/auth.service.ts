import { Injectable,UnauthorizedException} from '@nestjs/common';
import { UsersService } from '../users/users.service.js';
import { JwtService } from '@nestjs/jwt';
import {verify,hash} from "argon2"
import { Response } from 'express';
import { db } from '../database/db.js';
import { account } from '../database/schemas.js';
import { eq } from 'drizzle-orm';
import {MailerService} from "@nestjs-modules/mailer"

type IUser={
    email:string;
    password:string;
}
type IRegister={
    email:string;
    password:string;
    name:string;
}
@Injectable()
export class AuthService {
    constructor(
        private  userServices:UsersService,
        private  jwtService:JwtService,
        private readonly mailerService:MailerService
    ){}

   async signIn({email,password}:IUser):Promise<any>{

    const {data}:any= await this.userServices.userAuth(email);
    
    if (!data || data.length === 0) {
     throw new UnauthorizedException("E-mail ou senha incorretos");
    }
    
    if(!(await verify(data[0].password,password))){
        throw new UnauthorizedException("Senha Incorreta");
    }

    const payload={id:data[0].id,name:data[0].name,email:data[0].email,role:data[0].role};
    
    const access_token= await this.jwtService.signAsync({...payload,type:'access'},{expiresIn:"15m"})
    const refresh_token= await this.jwtService.signAsync({...payload,type:'refresh'},{expiresIn:"7d"})
    await this.userServices.saveRefreshToken(data[0].id,refresh_token)
    
    return {access_token,refresh_token};
   }


   async refreshTokens(refreshToken:string,res:Response){

    try{
    const payload= await this.jwtService.verify(refreshToken,{secret:process.env.JWT_SECRET!});
     
    const {new_access_token,new_refresh_token}=await this.userServices.validateAndRotateRefreshToken(payload.id,refreshToken)
    res.cookie('access_token',new_access_token,{
        httpOnly:true,
        secure:true,
        sameSite:'lax',
        maxAge:15*60*1000
    })

    res.cookie("refresh_token",new_refresh_token,{
        httpOnly:true,
        secure:true,
        sameSite:'lax',
        maxAge:7*24*60* 60* 1000
    });
    return {new_access_token,new_refresh_token}
    }catch{
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');
        throw new UnauthorizedException("Sessão expirada");
    }
   }

   async signUp({email,password,name}:IRegister){
    const {message,error} =await this.userServices.createUser({email,password,name});

    if(error){
        return {messageError:error}
    }
    return {message}
   }
   
   async removeRefreshToken(id: string) {
    // Apenas seta o token como null no banco, sem gerar novos tokens
    return await db.update(account)
        .set({ token: null }) 
        .where(eq(account.id, id));
}


   async clearSession(refresh_token:string){
    try{
    const payload = this.jwtService.decode(refresh_token);
    if (payload){
        await this.removeRefreshToken(payload.id);
    }
    }catch{}
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
        await db.update(account).set({code:geradorDeCodigo()})
        await this.mailerService.sendMail({
            to:user[0].email,
            subject:"Resete de Senha",
            template:'template',
        })
    }
   }

   async resetPassword(password:string,code:string){
      const codePass= await db.select({code:account.code}).from(account).where(eq(account.code,code))
      if(codePass){
        await db.update(account).set({password:await hash(password)})
        return {message:'Senha atualizada com sucesso'}
      }else{
        return {error:"Falha ao resetar senha"}
      }
   }
   


}
