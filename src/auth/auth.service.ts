import { Injectable,UnauthorizedException} from '@nestjs/common';
import { UsersService } from '../users/users.service.js';
import { JwtService } from '@nestjs/jwt';
import {verify,hash} from "argon2"

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
     throw new UnauthorizedException();
    }

    const payload={id:data[0].id,name:data[0].name,email:data[0].email};
    
    if(!(await verify(data[0].password,password))){
        throw new UnauthorizedException();
    }
    
    const access_token= await this.jwtService.signAsync(payload,{expiresIn:"15m"})
    const refresh_token= await this.jwtService.signAsync(payload,{expiresIn:"7d"})
    await this.userServices.updateRefreshToken(data[0].id,await hash(refresh_token))
    
    return {access_token,refresh_token};
   }


   async refreshTokens(email:string,refreshToken:string){
    const {data}= await this.userServices.userAuth(email)
    if (!data || data.length ===0) throw new UnauthorizedException();

    const isRefreshTokenValid =await verify(data[0].token,refreshToken);

    if(!isRefreshTokenValid){
        throw new UnauthorizedException("Sessão expirada");
    }

    const payload={ id: data[0].id, name: data[0].name, email: data[0].email };
    const access_token = await this.jwtService.signAsync(payload, { expiresIn: "15m" });
    const new_refresh_token = await this.jwtService.signAsync(payload, { expiresIn: "7d" });
    await this.userServices.updateRefreshToken(data[0].id, await hash(new_refresh_token));
    
    return {
        access_token,
        refresh_token: new_refresh_token,
     };
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
        await this.userServices.updateRefreshToken(payload.id,null);
    }
   }

   

}
