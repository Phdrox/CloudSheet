import { Injectable,UnauthorizedException} from '@nestjs/common';
import { UsersService } from '../users/users.service.js';
import { JwtService } from '@nestjs/jwt';
import {verify,hash} from "argon2"
import { Response } from 'express';

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
        private  jwtService:JwtService
    ){}

   async signIn({email,password}:IUser):Promise<any>{

    const {data}= await this.userServices.userAuth(email);
    
    if (!data || data.length === 0) {
     throw new UnauthorizedException("E-mail ou senha incorretos");
    }
    
    if(!(await verify(data[0].password,password))){
        throw new UnauthorizedException("Senha Incorreta");
    }

    const payload={id:data[0].id,name:data[0].name,email:data[0].email};
    
    const access_token= await this.jwtService.signAsync({...payload,type:'access'},{expiresIn:"15m"})
    const refresh_token= await this.jwtService.signAsync({...payload,type:'refresh'},{expiresIn:"7d"})
    await this.userServices.updateRefreshToken(data[0].id,refresh_token)
    
    return {access_token,refresh_token};
   }


   async refreshTokens(refreshToken:string,res:Response){

    try{
    const payload= await this.jwtService.verify(refreshToken);
     
    const {new_access_token,new_refresh_token}=await this.userServices.updateRefreshToken(payload.id,refreshToken)
    res.cookie('access_token',new_access_token,{
        httpOnly:true,
        secure:true,
        sameSite:'lax',
        maxAge:60*1000
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

   async clearSession(refresh_token:string){
    const payload = await this.jwtService.decode(refresh_token)
    if (payload){
        await this.userServices.updateRefreshToken(payload.email,null);
    }
   }

}
