import { Injectable,UnauthorizedException} from '@nestjs/common';
import { UsersService } from 'src/users/users.service.js';
import { JwtService } from '@nestjs/jwt';
import {verify} from "argon2"

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
    const payload={id:data[0].id,name:data[0].name,email:data[0].email};
    
    if(!verify(password,data[0].password)){
        throw new UnauthorizedException();
    }

    return {access_token: await this.jwtService.signAsync(payload)};
   }

   async signUp({email,password,name}:IRegister){
    const {message,error} =await this.userServices.createUser({email,password,name});

    if(error){
        return {messageError:error}
    }
    return {message}
   }


}
